export const addLineBreaks = (content: string) => {
  return content.replace(/(?:\r\n|\r|\n)/g, "<br>");
};
