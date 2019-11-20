import appoloClient from "./apolloClient";

const executeQuery = async (query, variables = {}) => {
  const result = await appoloClient(true).query({
    query: query,
    variables: variables,
  });

  return result;
};

export default executeQuery;
