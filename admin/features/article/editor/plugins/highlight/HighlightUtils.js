export const hasMark = value =>
    value.marks.some(mark => mark.type === "highlight");

export const highlightMarkStrategy = change =>
    change.toggleMark("highlight").focus();
