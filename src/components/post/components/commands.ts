import { Editor } from "@tinymce/tinymce-react";

export const insertImageInEditor = (editor: Editor["editor"], images: any) => {
  images.map((image) => {
    const range = editor?.selection.getRng(); // get range: ;
    const doc = editor?.getDoc();
    const newNode = doc?.createElement("figure");
    if (newNode && range) {
      newNode.innerHTML = `
        <figure>
            <img src="${image.src}" alt="${image.caption}">
            <figcaption>${image.caption}</figcaption>
        </figure>
      `;
      range.insertNode(newNode);
      const lineBreak = doc?.createElement("br");
      if (lineBreak) range.insertNode(lineBreak);
    }
  });
};
