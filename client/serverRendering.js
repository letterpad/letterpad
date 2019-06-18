const { dispatcher } = require("./dispatcher");
const { GET_OPTIONS } = require("../shared/queries/Queries");
const apolloClient = require("../shared/apolloClient").default;

module.exports.init = app => {
  app.get("*", (req, res, next) => {
    if (req.url === "/graphql") return next();
    if (req.url.indexOf("/static") === 0) return next();

    const isStatic = req.get("static");

    const client = apolloClient(false, null, { ssrMode: true });
    // get the settings data. It contains information about the theme that we want to render.
    client
      .query({ query: GET_OPTIONS })
      .then(options => {
        dispatcher(req.url, client, options, isStatic)
          .then(content => res.send(content))
          .catch(err => res.send(err));
      })
      .catch(e => {
        console.log(e);
      });
  });
};
