import { RegisterStep } from "@/__generated__/__types__";

export const gaTrackingId = "G-D8L4KM499F";
// export { basePath } from "../next.config";

export const basePath = "";

export const registrationPaths = {
  [RegisterStep.ProfileInfo]: "/update/profile-info",
  [RegisterStep.SiteInfo]: "/update/site-info",
  [RegisterStep.Registered]: "/posts",
};
