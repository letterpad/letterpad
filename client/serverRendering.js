const { ApolloClient } = require("apollo-client");
const { ApolloLink } = require("apollo-link");
const { onError } = require("apollo-link-error");
const fetch = require("isomorphic-fetch");
const config = require("../config");
const { createHttpLink } = require("apollo-link-http");
const { InMemoryCache } = require("apollo-cache-inmemory");

const { dispatcher } = require("./dispatcher");

const { GET_OPTIONS } = require("../shared/queries/Queries");

// handle errors whie fetching data in the server.
const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
  uri: config.apiUrl,
  fetch,
});

const link = ApolloLink.from([errorLink, httpLink]);

module.exports.init = app => {
  app.get("*", (req, res, next) => {
    if (req.url === "/graphql") return next();

    const isStatic = req.get("static");
    // using the apolloclient we can fetch data from the backend
    const client = new ApolloClient({
      ssrMode: true,
      link: link,
      cache: new InMemoryCache(),
    });

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
