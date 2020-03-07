/**
 * For admin dashboard we dont need server sided rendering
 */
import { Express } from "express-serve-static-core";
import config from "../../config";
import { createPR } from "./response/createPullRequest";
import { generateStaticSite } from "./response/generateStaticSite";
import { getHtml } from "./response/sendHtml";
import { getThemes } from "./response/getThemes";
import { setupLetterpad } from "../setup";
import unsplash from "./response/unsplash";

export const clientOpts = {
  ssrMode: false,
  fetchPolicy: "no-cache",
};
const base = config.BASE_NAME;
export default (app: Express) => {
  app.get(base + "/admin/generateStaticSite", generateStaticSite);
  app.get(base + "/admin/create-pull-request", createPR);
  app.get(base + "/admin/getThemes", getThemes);
  app.get(base + "/admin/unsplash/page/:page/query/:query", unsplash);
  app.get(base + "/admin/*", getHtml);
  app.get(base + "/initial-setup", setupLetterpad);
};
