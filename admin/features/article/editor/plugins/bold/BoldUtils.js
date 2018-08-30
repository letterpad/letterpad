export const hasMark = value => value.marks.some(mark => mark.type === "bold");

export const boldMarkStrategy = change => change.toggleMark("bold").focus();
