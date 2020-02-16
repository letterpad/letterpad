import { IServerRenderProps } from "../types";
import { getDirPath } from "./../../dir";
import { getHtml } from "./html";
import logger from "../../shared/logger";
import serverApp from "./serverApp";
const fs = require("fs");
const path = require("path");
// const { getHtml } = require("./html");

export const dispatcher = async (props: IServerRenderProps) => {
  const { settings, isStatic } = props;
  let theme = settings.theme.value;
  // In dev mode if a theme is explicitly called, then use that
  if (process.env.theme && process.env.theme !== "") {
    theme = process.env.theme;
  }
  // Get the server file based on the appropriate theme
  // let serverFile = path.join(
  //   getDirPath("client/themes/" + theme + "/public/dist/server.node.js"),
  // );
  // if (!fs.existsSync(serverFile)) {
  //   return Promise.reject(
  //     "Server file does not exist on path " +
  //       serverFile +
  //       ". Wait for the build to finish and try again after some time.",
  //   );
  // }
  // this is the bundle file from server.js which returns a promise
  // const server = require(serverFile).default;
  const server = serverApp;
  // logger.debug("Loaded SSR server file to run => ", serverFile);
  try {
    const response = await server(props);
    if (response) {
      const { html, apolloState, initialData, head, sheet } = response;
      let styles = "";
      if (sheet) styles = sheet.getStyleTags(); // <-- getting all the tags from the sheet
      const content = getHtml({
        theme,
        html,
        apolloState,
        initialData,
        head,
        settings,
        styles,
        isStatic,
      });
      return content;
    } else {
      console.log("Response =>", response);
      return "Error while rendering";
    }
  } catch (E) {
    console.log(E);
  }
};
