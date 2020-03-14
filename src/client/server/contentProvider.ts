import { getHeadHtml, getHtml } from "./html";

import { Helmet } from "react-helmet";
import { IServerRenderProps } from "../types";
import { ServerStyleSheet } from "styled-components";
import config from "../../config";
import serverApp from "./serverApp";

let styles;
export const contentProvider = async (props: IServerRenderProps) => {
  const { settings, isStatic } = props;
  let theme = settings.theme.value;
  // In dev mode if a theme is explicitly called, then use that
  if (config.THEME) {
    theme = config.THEME;
  }

  let response: any = {
    html: "",
    apolloState: {},
    initialData: { settings },
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
  if (response) {
    const { html, apolloState, initialData, head, sheet } = response;

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
  }
};

export const generateHead = (props: IServerRenderProps) => {
  const { settings, isStatic } = props;
  let theme = settings.theme.value;
  // In dev mode if a theme is explicitly called, then use that
  if (config.THEME) {
    theme = config.THEME;
  }
  return getHeadHtml({
    head: Helmet.renderStatic(),
    theme,
    settings,
    styles: styles || new ServerStyleSheet().getStyleTags(),
  });
};
