// import { keyboardEvent } from "@slate-editor/utils";
import { forceClickUploadButton } from "./ImageUtils";
import { isMod } from "../../helper/keyboard-event";

const ImageKeyboardShortcut = (event, change, editor) => {
  if (isMod(event) && event.shiftKey && event.key === "i") {
    return forceClickUploadButton(editor);
  }
  return;
};

export default ImageKeyboardShortcut;
