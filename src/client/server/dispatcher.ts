import { IServerRenderProps } from "../types";
import { getHtml } from "./html";
import serverApp from "./serverApp";

export const dispatcher = async (props: IServerRenderProps) => {
  const { settings, isStatic } = props;
  let theme = settings.theme.value;
  // In dev mode if a theme is explicitly called, then use that
  if (process.env.theme && process.env.theme !== "") {
    theme = process.env.theme;
  }
  // logger.debug("Loaded SSR server file to run => ", serverFile);
  try {
    const response = await serverApp(props);
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
