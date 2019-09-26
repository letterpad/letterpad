import { graphql } from "@apollo/react-hoc";
import { UPDATE_POST_QUERY } from "../../shared/queries/Mutations";

export default graphql(UPDATE_POST_QUERY, {
  props: ({ mutate }) => ({
    update: data => {
      return mutate({
        variables: data,
        updateQueries: {
          getPost: (previousResult, { mutationResult }) => {
            return {
              post: {
                ...previousResult.post,
                ...mutationResult.data.updatePost.post,
              },
              __typename: previousResult.post.__typename,
            };
          },
        },
      });
    },
  }),
});
