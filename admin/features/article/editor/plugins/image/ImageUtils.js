import scrollToCursor from "../../helper/scrollToCursor";

export const insertInlineImage = ({ change, src }) => {
  scrollToCursor();
  return change
    .insertInline({
      type: "image",
      isVoid: true,
      data: { src },
    })
    .collapseToStartOfNextText()
    .focus();
};

export const updateInlineImage = ({
  change,
  data: { src, title, href, openExternal },
}) => {
  return href
    ? change.setInline({
        type: "imageLink",
        isVoid: true,
        data: { src, title, href, openExternal },
      })
    : change.setInline({
        type: "image",
        isVoid: true,
        data: { src, title, openExternal },
      });
};

export const deleteInlineImage = ({ change }) => {
  return change.deleteBackward(1);
};

export const forceClickUploadButton = editor => {
  window.document
    .getElementById(`slate-image-plugin-button-${editor.props.outerState.uid}`)
    .click();
};
