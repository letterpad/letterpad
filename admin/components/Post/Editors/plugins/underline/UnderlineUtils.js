export const hasMark = value =>
    value.marks.some(mark => mark.type === "underline");

export const underlineMarkStrategy = change =>
    change.toggleMark("underline").focus();
