import { Editor } from "@tinymce/tinymce-react";

export const insertImageInEditor = (editor: Editor["editor"], images: any) => {
  images.reverse().map((image, index) => {
    if (index > 0) {
      const range = editor?.selection.getRng();
      const doc = editor?.getDoc();
      const lineBreak = doc?.createElement("br");
      if (lineBreak) {
        range?.insertNode(lineBreak);
        editor?.selection.select(lineBreak);
      }
    }
    editor?.execCommand("mceUpdateImage", false, {
      src: image.src,
      width: image.width,
      height: image.height,
      caption: true,
      alt: image.caption,
    });
  });
};
