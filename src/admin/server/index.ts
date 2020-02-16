/**
 * For admin dashboard we dont need server sided rendering
 */
import { Express } from "express-serve-static-core";
import { getHtml } from "./response/sendHtml";
import { getThemes } from "./response/getThemes";
import { generateStaticSite } from "./response/generateStaticSite";
import { createPR } from "./response/createPullRequest";
import { setupLetterpad } from "../setup";
import config from "../../config";

export const clientOpts = {
  ssrMode: false,
  fetchPolicy: "no-cache",
};

export default (app: Express) => {
  app.get(config.BASE_NAME + "/admin/generateStaticSite", generateStaticSite);
  app.get(config.BASE_NAME + "/admin/create-pull-request", createPR);
  app.get(config.BASE_NAME + "/admin/getThemes", getThemes);
  app.get(config.BASE_NAME + "/admin/*", getHtml);
  app.get(config.BASE_NAME + "/initial-setup", setupLetterpad);
};
