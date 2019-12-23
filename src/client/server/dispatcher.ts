const fs = require("fs");
const path = require("path");
const { getHtml } = require("./html");

export const dispatcher = async (url, client, options, isStatic) => {
  const settings: any = {};
  options.data.settings.forEach(item => {
    settings[item.option] = item;
  });
  let theme = settings.theme;
  // In dev mode if a theme is explicitly called, then use that
  if (process.env.theme && process.env.theme !== "") {
    theme = process.env.theme;
  }
  // Get the server file based on the appropriate theme
  let serverFile = "../themes/" + theme + "/public/dist/server.node.js";

  if (!fs.existsSync(path.join(__dirname, serverFile))) {
    return Promise.reject(
      "Server file does not exist. Wait for the build to finish and try again after some time.",
    );
  }
  // this is the bundle file from server.js which returns a promise
  const server = require(serverFile).default;
  try {
    const response = await server(url, client, settings, isStatic);
    if (response) {
      const { html, apolloState, initialData, head, sheet } = response;
      let styles = "";
      if (sheet) styles = sheet.getStyleTags(); // <-- getting all the tags from the sheet
      const content = getHtml(
        theme,
        html,
        apolloState,
        initialData,
        head,
        settings,
        styles,
        isStatic,
      );
      return content;
    } else {
      console.log("Response =>", response);
      return "Error while rendering";
    }
  } catch (E) {
    console.log(E);
  }
};
