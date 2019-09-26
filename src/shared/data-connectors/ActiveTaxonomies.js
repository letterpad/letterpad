import { graphql } from "@apollo/react-hoc";
import { GET_POSTS_LINKED_TAXONOMIES } from "../queries/Queries";

export default graphql(GET_POSTS_LINKED_TAXONOMIES, {
  options: {
    variables: { type: "post_category", postType: "post" },
  },
  props: ({ data: { loading, postTaxonomies } }) => ({
    categories: postTaxonomies,
    loading,
  }),
});
