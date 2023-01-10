import { RegisterStep } from "@/__generated__/__types__";

export const gaTrackingId = "UA-120251616-1";
export { basePath } from "../next.config";

export const registrationPaths = {
  [RegisterStep.ProfileInfo]: "/update/profile-info",
  [RegisterStep.SiteInfo]: "/update/site-info",
  [RegisterStep.Registered]: "/posts",
};
