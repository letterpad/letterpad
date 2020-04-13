import { Handler } from "express";

export default function graphiqlMiddleware({
  graphqlEndpoint,
}: {
  graphqlEndpoint: string;
}): Handler {
  return (req, res) => {
    res.end(getGraphiqlHtml(graphqlEndpoint));
  };
}

function getGraphiqlHtml(endpoint: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>GraphiQL</title>
  <meta name="robots" content="noindex" />
  <meta name="referrer" content="origin" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      margin: 0;
      overflow: hidden;
    }
    #graphiql {
      height: 100vh;
    }
  </style>
  <link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
</head>
<body>
  <div id="graphiql"></div>
  <script
    crossorigin
    src="https://unpkg.com/react/umd/react.production.min.js"
  >
  </script>
  <script
    crossorigin
    src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
  >
  </script>
  <script
    crossorigin
    src="https://unpkg.com/graphiql/graphiql.min.js"
  >
  </script>
  <script>
    const graphQLFetcher = graphQLParams =>
      fetch('${endpoint}', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graphQLParams),
      })
        .then(response => response.json())
        .catch(() => response.text());
    ReactDOM.render(
      React.createElement(GraphiQL, { fetcher: graphQLFetcher }),
      document.getElementById('graphiql'),
    );
  </script>
</body>
</html>
  `;
}
