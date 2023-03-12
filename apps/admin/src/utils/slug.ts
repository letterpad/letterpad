import { tryToParseCategoryName } from "./utils";

export const textToSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(" ")
    .filter(function (substr) {
      return substr.length > 0;
    })
    .join("-");
};

export const getLastPartFromPath = (path: string) => {
  return (path.split("/").pop() as string).toLowerCase();
};

export const createPathWithPrefix = (text: string, prefix: string) => {
  return (
    `/${prefix}/` + tryToParseCategoryName(text.replace(`/${prefix}/g`, ""))
  );
};
