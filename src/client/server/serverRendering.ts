const { dispatcher } = require("./dispatcher");
import apolloClient from "../../shared/apolloClient";
import { GET_OPTIONS } from "../../shared/queries/Queries";

module.exports.init = app => {
  app.get("*", async (req, res, next) => {
    if (req.url === "/graphql") return next();
    if (req.url.indexOf("/static") === 0) return next();

    const isStatic = req.get("static");
    try {
      const client = apolloClient(false, { ssrMode: true });
      // get the settings data. It contains information about the theme that we want to render.
      const settings = await client.query({ query: GET_OPTIONS });
      const content = await dispatcher(req.url, client, settings, isStatic);
      res.send(content);
    } catch (e) {
      res.send(e);
    }
  });
};
