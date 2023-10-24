import { PostStatusOptions } from "../../__generated__/__types__";

const CATEGORY_PARSER_REGEX = /_\d{0,2}_/;

export const isCategory = (tag: string): boolean => {
  const category = tag.split(CATEGORY_PARSER_REGEX)[1];
  return !!category;
};

export const tryToParseCategoryName = (tag: string): string => {
  const category = tag.split(CATEGORY_PARSER_REGEX)[1];
  return category || tag;
};

export const parseDrafts = (
  drafts: string | null = "",
  status?: PostStatusOptions
) => {
  try {
    if (typeof drafts === "string") {
      return JSON.parse(drafts);
    }
  } catch (e) {
    return [
      {
        content: drafts,
        timestamp: new Date().toISOString(),
        patches: [],
        live: status === PostStatusOptions.Published,
      },
    ];
  }
  return drafts;
};
