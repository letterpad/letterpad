import showdown from "showdown";

const converter = new showdown.Converter();

export const mdToHtml = (md: string) => converter.makeHtml(md);
