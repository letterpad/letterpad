import { graphql } from "react-apollo";
import { UPDATE_POST_QUERY } from "../../shared/queries/Mutations";

export default graphql(UPDATE_POST_QUERY, {
  props: ({ mutate }) => ({
    update: data => {
      return mutate({
        variables: data,
        updateQueries: {
          getPost: (prev, { mutationResult }) => {
            return {
              post: {
                ...prev.post,
                ...mutationResult.data.updatePost.post,
              },
            };
          },
        },
      });
    },
  }),
});
