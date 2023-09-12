import DiffMatchPatch from "diff-match-patch";

import { PostHistoryItem } from "../types";

export class PostVersion {
  private history: Array<PostHistoryItem> = [];
  private dmp: DiffMatchPatch = new DiffMatchPatch();

  constructor(history: Array<PostHistoryItem>) {
    this.history = history;
  }

  getHistory() {
    return this.history;
  }

  createInitialEntry(content: string): void {
    // Create the initial entry when a new blog is created
    const entry: PostHistoryItem = {
      timestamp: this.getCurrentTimestamp(),
      content: content,
      patches: [],
      active: true,
      live: false,
    };
    this.history.push(entry);
  }

  retrieveActiveVersion() {
    return this.history.find((item) => item.active);
  }

  getLastUpdateInSeconds() {
    if (this.history.length > 0)
      return secondsAgo(this.history[this.history.length - 1].timestamp);
  }

  replacePreviousBlog(newContent: string) {
    this.history.pop();
    this.updateBlog(newContent);
  }

  updateBlog(newContent: string): void {
    if (this.history.length === 0) {
      return this.createInitialEntry(newContent);
    }

    const currentContent = this.history[0].content;
    const patches = this.dmp.patch_make(currentContent, newContent);
    const entry: PostHistoryItem = {
      timestamp: this.getCurrentTimestamp(),
      live: false,
      patches: patches,
      active: true,
    };
    this.resetActive();
    this.history.push(entry);
  }

  private resetActive() {
    this.history = this.history.map((item) => ({ ...item, active: false }));
  }

  makeBlogLiveAtTimestamp(timestamp: string) {
    this.history = this.history.map((item) => ({
      ...item,
      live: item.timestamp === timestamp,
    }));
    return this.history;
  }

  retrieveBlogAtTimestamp(timestamp: string): string | null {
    const initialContent = this.history[0]?.content;
    for (let i = this.history.length - 1; i >= 0; i--) {
      const entry = this.history[i];
      if (entry.timestamp === timestamp) {
        this.resetActive();
        this.history[i].active = true;
        // Apply patches to retrieve the content at the specified timestamp
        const patches = entry.patches;
        const [restoredContent] = this.dmp.patch_apply(patches, initialContent);
        return restoredContent;
      }
    }
    return null; // Timestamp not found in history
  }

  retrieveBlogAtIndex(index: number): string | null {
    const initialContent = this.history[0]?.content;
    for (let i = this.history.length - 1; i >= 0; i--) {
      const entry = this.history[i];
      if (i === index) {
        this.resetActive();
        this.history[i].active = true;
        // Apply patches to retrieve the content at the specified timestamp
        const patches = entry.patches;
        const [restoredContent] = this.dmp.patch_apply(patches, initialContent);
        return restoredContent;
      }
    }
    return null; // Timestamp not found in history
  }

  getStatus() {
    const index = this.history.findIndex((item) => item.live);
    if (index > 0) return this.history.length - index;
    return 0;
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }
}

const secondsAgo = (datetime) => {
  const currentDatetime = new Date();
  const providedDatetime = new Date(datetime);

  // Calculate the time difference in milliseconds
  const timeDifference = currentDatetime.getTime() - providedDatetime.getTime();

  // Convert milliseconds to seconds
  const secondsDifference = Math.floor(timeDifference / 1000);

  return secondsDifference;
};