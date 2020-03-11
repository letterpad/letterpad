import { getHeadHtml, getHtml } from "./html";

import { Helmet } from "react-helmet";
import { IServerRenderProps } from "../types";
import { ServerStyleSheet } from "styled-components";
import serverApp from "./serverApp";

let styles;
export const contentProvider = async (props: IServerRenderProps) => {
  const { settings, isStatic } = props;
  let theme = settings.theme.value;
  // In dev mode if a theme is explicitly called, then use that
  if (process.env.theme && process.env.theme !== "") {
    theme = process.env.theme;
  }

  try {
    const response = await serverApp(props);
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
    } else {
      console.log("Response =>", response);
      return "Error while rendering";
    }
  } catch (E) {
    console.log(E);
  }
};

export const generateHead = (props: IServerRenderProps) => {
  const { settings, isStatic } = props;
  let theme = settings.theme.value;
  // In dev mode if a theme is explicitly called, then use that
  if (process.env.theme && process.env.theme !== "") {
    theme = process.env.theme;
  }
  return getHeadHtml({
    head: Helmet.renderStatic(),
    theme,
    settings,
    styles: styles || new ServerStyleSheet().getStyleTags(),
  });
};
