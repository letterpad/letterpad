import DiffMatchPatch from "diff-match-patch";

import { PostHistoryItem } from "../types";

export class PostVersion {
  private history: Array<PostHistoryItem> = [];
  private dmp: DiffMatchPatch = new DiffMatchPatch();

  constructor(history: Array<PostHistoryItem> = []) {
    if (!history || history?.length === 0) {
      this.createInitialEntry("");
    } else {
      this.history = history;
    }
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
    const prevItem = this.history.pop();
    this.updateBlog(newContent, !!prevItem?.live);
  }

  updateBlog(newContent: string, isLive: boolean = false): void {
    if (this.history.length === 0) {
      return this.createInitialEntry(newContent);
    }

    let initialContent =
      this.history.find((item) => item.content?.length > 0)?.content ?? "";

    if (!initialContent) {
      initialContent =
        this.retrieveBlogAtIndex(this.history.length - 1, false) ?? "";
    }
    const [restoredContent] = this.dmp.patch_apply(
      this.history[this.history.length - 1].patches || [],
      initialContent
    );

    const patches = this.dmp.patch_make(restoredContent, newContent);
    const entry: PostHistoryItem = {
      timestamp: this.getCurrentTimestamp(),
      live: isLive,
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

  retrieveBlogAtIndex(
    index: number,
    makeItActive: boolean = true
  ): string | null {
    const initialContent =
      this.history[0]?.content ||
      this.dmp.patch_apply(this.history[1]?.patches ?? [], "");
    for (let i = this.history.length - 1; i >= 0; i--) {
      const entry = this.history[i];
      if (i === index) {
        if (makeItActive) {
          this.resetActive();
          this.history[i].active = true;
        }
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
    if (index < this.history.length - 1) return "update-live";
    return "";
  }

  fixFirstRecordEmptyContent(postVersions: PostVersion) {
    const history = postVersions.getHistory();
    try {
      if (history[0]?.content === "") {
        history[0].content = this.dmp.patch_apply(
          history[1]?.patches ?? [],
          ""
        )[0];
      }
    } catch (e) {}
    return history;
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
