export const CATEGORY_PARSER_REGEX = /_\d{0,2}_/;

export const isCategory = (tag: string): boolean => {
  const category = tag.split(CATEGORY_PARSER_REGEX)[1];
  return !!category;
};

export const tryToParseCategoryName = (tag: string): string => {
  const category = tag.split(CATEGORY_PARSER_REGEX)[1];
  return category || tag;
};
