const CATEGORY_PARSER_REGEX = /_\d{0,2}_/;

export const isCategory = (tag: string): boolean => {
  const category = tag.split(CATEGORY_PARSER_REGEX)[1];
  return !!category;
};

export const tryToParseCategoryName = (tag: string): string => {
  const category = tag.split(CATEGORY_PARSER_REGEX)[1];
  return category || tag;
};

export const categoryNameToSlug = (name: string) => {
  return name.replace(/ /g, "_").toLowerCase();
};

export const categorySlugToName = (slug: string) => {
  return convertInitialsToUpperCase(slug.replace(/_/g, " "));
};

const convertInitialsToUpperCase = (sentence: string) => {
  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
