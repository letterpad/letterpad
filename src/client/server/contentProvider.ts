import { IServerRenderProps } from "../types";
import { ReactElement } from "react";
import config from "../../config";
import documentRenderer from "./document-renderer";
import serverApp from "./serverApp";

export const contentProvider = async (props: IServerRenderProps) => {
  const { settings, themeSettings } = props;
  let theme = settings.theme;
  // In dev mode if a theme is explicitly called, then use that
  if (config.THEME) {
    theme = config.THEME;
  }

  let response: any = {
    html: "",
    apolloState: {},
    initialData: { settings, themeSettings },
    sheet: "",
  };
  if (config.NODE_ENV === "production") {
    try {
      //@ts-ignore
      props.request.res.write("<!DOCTYPE html>");
      response = await serverApp(props);
    } catch (e) {
      console.log(e);
      return "Error while rendering";
    }
  }

  const { html, apolloState, initialData, sheet } = response;

  let styleElements: ReactElement[] = [];

  if (sheet) {
    styleElements = sheet.getStyleElement();
    sheet.seal();
  }

  const content = documentRenderer({
    appHtml: html,
    styleElements,
    theme,
    settings,
    apolloState,
    initialData,
  });

  return content;
};
