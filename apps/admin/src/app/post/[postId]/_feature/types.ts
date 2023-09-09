import { Editor } from "@tinymce/tinymce-react";

import { Setting } from "@/__generated__/__types__";

export type PostContextType = {
  fileExplorerOpen: boolean;
  helpers: Editor["editor"] | undefined;
  setHelpers: (helpers: Editor["editor"]) => void;
  onFileExplorerClose: () => void;
  onMediaBrowse: () => void;
  settings?: Setting;
};

export enum NotPublished {
  NoTags = "NoTags",
  TagsNotLinkedWithNav = "TagsNotLinkedWithNav",
  PageNotLinkedWithNav = "PageNotLinkedWithNav",
}

export type PublishModals = "PostNotPublished" | "EmailAndPublish" | undefined;
