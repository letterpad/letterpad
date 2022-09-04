import Rollbar from "rollbar";

export const report = new Rollbar({
  accessToken: process.env.ROLLBAR_SERVER_TOKEN || "",
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: process.env.NODE_ENV === "production",
});
