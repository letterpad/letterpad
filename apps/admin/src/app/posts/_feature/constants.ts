import {
  PostStatusOptions,
  PostTypes,
  SortBy,
} from "graphql-letterpad";

export const DEFAULT_FILTERS = {
  sortBy: SortBy["Desc"],
  status: [PostStatusOptions.Published, PostStatusOptions.Draft],
  type: PostTypes.Post,
};
