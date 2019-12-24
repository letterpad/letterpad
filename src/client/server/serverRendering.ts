import { Express } from "express";

import apolloClient from "../../shared/apolloClient";
import { GET_OPTIONS } from "../../shared/queries/Queries";
import { GetOptionsQuery } from "../../__generated__/gqlTypes";
import { TypeSettings } from "../types";
import { dispatcher } from "./dispatcher";

const serverRendering = (app: Express) => {
  app.get("*", async (req, res, next) => {
    if (req.url === "/graphql") return next();
    if (req.url.indexOf("/static") === 0) return next();

    const isStatic = req.get("static") ? true : false;
    try {
      const client = apolloClient(false, { ssrMode: true });
      // get the settings data. It contains information about the theme that we want to render.
      const settings = await client.query<GetOptionsQuery>({
        query: GET_OPTIONS,
      });
      const formattedSettings: TypeSettings | {} = {};
      settings.data.settings.forEach(item => {
        formattedSettings[item.option] = item;
      });
      const content = await dispatcher({
        requestUrl: req.url,
        client,
        settings: formattedSettings as TypeSettings,
        isStatic,
      });
      res.send(content);
    } catch (e) {
      res.send(e);
    }
  });
};

export default serverRendering;
