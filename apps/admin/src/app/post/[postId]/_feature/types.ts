import { Editor } from "@tinymce/tinymce-react";
import { Setting } from "graphql-letterpad";

export type PostContextType = {
  fileExplorerOpen: boolean;
  helpers: Editor["editor"] | undefined;
  setHelpers: (helpers: Editor["editor"]) => void;
  onFileExplorerClose: () => void;
  onMediaBrowse: () => void;
  settings?: Setting;
};
