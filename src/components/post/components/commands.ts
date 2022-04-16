import { Editor } from "@tinymce/tinymce-react";

export const insertImageInEditor = (editor: Editor["editor"], images: any) => {
  images.map((image) => {
    const range = editor?.selection.getRng(); // get range: ;
    const doc = editor?.getDoc();
    const newNode = doc?.createElement("figure");
    if (newNode && range) {
      newNode.innerHTML = `
            <img src="${image.src}" alt="${image.caption}" style="display: block; margin-left: auto; margin-right: auto;">
            <figcaption contexteditable="false">${image.caption}</figcaption>
      `;
      range.insertNode(newNode);
      const lineBreak = doc?.createElement("br");
      if (lineBreak) range.insertNode(lineBreak);
    }
  });
};
