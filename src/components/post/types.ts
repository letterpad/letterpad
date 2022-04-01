import { Setting } from "@/__generated__/__types__";
import { Editor } from "@tinymce/tinymce-react";

export type PostContextType = {
  fileExplorerOpen: boolean;
  helpers: Editor["editor"] | undefined;
  setHelpers: (helpers: Editor["editor"]) => void;
  onFileExplorerClose: () => void;
  onMediaBrowse: () => void;
  settings?: Setting;
};
