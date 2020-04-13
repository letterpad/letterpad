import { IServerRenderProps } from "../types";
import config from "../../config";
import { getHtml } from "./html";
import serverApp from "./serverApp";

let styles;
export const contentProvider = async (props: IServerRenderProps) => {
  const { settings, isStatic, themeSettings } = props;
  let theme = settings.theme;
  // In dev mode if a theme is explicitly called, then use that
  if (config.THEME) {
    theme = config.THEME;
  }

  let response: any = {
    html: "",
    apolloState: {},
    initialData: { settings, themeSettings },
    head: "",
    sheet: "",
  };
  if (config.NODE_ENV === "production") {
    try {
      response = await serverApp(props);
    } catch (E) {
      console.log(E);
      return "Error while rendering";
    }
  }

  const { html, apolloState, initialData, head, sheet } = response;

  if (sheet) {
    styles = sheet.getStyleTags();
    sheet.seal();
  }
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
};
