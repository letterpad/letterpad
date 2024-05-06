import { Editor } from "@tinymce/tinymce-react";
import { Setting } from "letterpad-graphql";

export type PostContextType = {
  fileExplorerOpen: boolean;
  helpers: Editor["editor"] | undefined;
  setHelpers: (helpers: Editor["editor"]) => void;
  onFileExplorerClose: () => void;
  onMediaBrowse: () => void;
  settings?: Setting;
  saving: boolean;
  setSaving: (saving: boolean) => void;
};
