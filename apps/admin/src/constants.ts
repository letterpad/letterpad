export const gaTrackingId = "G-D8L4KM499F";
import {
  PostStatusOptions,
  PostTypes,
  RegisterStep,
  SortBy,
} from "letterpad-graphql";

export const basePath = "";

export const registrationPaths = {
  [RegisterStep.ProfileInfo]: "/update/profile-info",
  [RegisterStep.SiteInfo]: "/update/site-info",
  [RegisterStep.Registered]: "/posts",
};

export const DEFAULT_FILTERS = {
  sortBy: SortBy["Desc"],
  status: [PostStatusOptions.Published, PostStatusOptions.Draft],
  type: PostTypes.Post,
  page: 1,
  limit: 10,
};
