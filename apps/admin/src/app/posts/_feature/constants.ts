import {
  PostStatusOptions,
  PostTypes,
  SortBy,
} from "@/__generated__/__types__";

export const DEFAULT_FILTERS = {
  sortBy: SortBy["Desc"],
  status: [PostStatusOptions.Published, PostStatusOptions.Draft],
  type: PostTypes.Post,
};
