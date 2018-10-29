export const hasMark = value =>
  value.marks.some(mark => mark.type === "italic");

export const italicMarkStrategy = change => change.toggleMark("italic").focus();
