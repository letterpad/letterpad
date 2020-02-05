import config from "./config";
import express from "express";
import { getDirectories } from "./shared/dir";

const base = config.BASE_NAME.length > 0 ? config.BASE_NAME : "";

/**
 * Make the below folders static
 *  Root public folder,
 *  Admin public folder,
 *  Theme public folder,
 *  Static Site folder
 */
const staticPaths = app => {
  // Expose the root public folder.
  app.use(base, express.static(__dirname + "/public"));

  // Expose the admin/public folder.
  app.use(base + "/admin/", express.static(__dirname + "/admin/public"));

  // Expose the static folder for static site
  app.use(base + "/static", express.static("letterpad-static"));

  // Every theme has a public directory for its assets. So we need to expose that.
  getDirectories(__dirname + "/client/themes/").map((themePath: string) => {
    // get the theme folder name
    const theme = themePath.split("/").pop();
    // expose the public folder. This can be accessed as /theme-name/css/style.css
    // in dev mode, this is required.
    app.use(base + "/" + theme + "/", express.static(themePath + "/public"));
    // Also provide a way to access the client folder
    app.use(base + "/client/", express.static(themePath + "/public"));
  });
};

export default staticPaths;
