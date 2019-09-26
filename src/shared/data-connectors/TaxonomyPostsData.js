import { graphql } from "@apollo/react-hoc";
import { SEARCH_POSTS_BY_TAXONOMY } from "../queries/Queries";
import config from "../../config";

export default graphql(SEARCH_POSTS_BY_TAXONOMY, {
  options: props => {
    let offset =
      props.match.params.page_no == 1 ? 0 : props.match.params.page_no;
    let type = "";
    if (props.type === "category") {
      type = "post_category";
    } else if (props.type === "tag") {
      type = "post_tag";
    }
    return {
      variables: {
        type,
        slug: props.query || props.match.params.query,
        postType: "post",
        limit: props.limit || config.itemsPerPage,
        offset: parseInt(props.offset || offset || 0),
      },
    };
  },
  props: ({ data: { loading, postsByTaxSlug, fetchMore } }) => {
    return {
      posts: (postsByTaxSlug && postsByTaxSlug.posts) || [],
      total: (postsByTaxSlug && postsByTaxSlug.count) || 0,
      loading,
      fetchMore: variables => {
        return fetchMore({
          variables: variables,
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              postsByTaxSlug: {
                count: fetchMoreResult.postsByTaxSlug.count,
                posts: [
                  ...previousResult.postsByTaxSlug.posts,
                  ...fetchMoreResult.postsByTaxSlug.posts,
                ],
                __typename: previousResult.postsByTaxSlug.__typename,
              },
            };
          },
        });
      },
    };
  },
});
