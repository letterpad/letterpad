import { graphql } from "@apollo/react-hoc";
import { GET_AUTHOR, GET_AUTHORS } from "../../shared/queries/Queries";

export const GetAuthor = graphql(GET_AUTHOR, {
  options: props => {
    return {
      variables: {
        id: props.match.params.id || props.author.id,
      },
    };
  },
  props: ({ data: { loading, author } }) => ({
    author,
    loading,
  }),
});

export const GetAuthors = graphql(GET_AUTHORS, {
  props: ({ data: { loading, authors } }) => ({
    authors,
    loading,
  }),
});
