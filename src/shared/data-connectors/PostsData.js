import { graphql } from "@apollo/react-hoc";
import { MENU_CONTENT } from "../queries/Queries";
import config from "../../config";

export default graphql(MENU_CONTENT, {
  options: props => {
    let offset =
      props.match.params.page_no == 1 ? 0 : props.match.params.page_no;
    return {
      variables: {
        type: "post_category",
        slug: props.slug || props.match.params.slug,
        postType: "post",
        limit: props.limit || config.itemsPerPage,
        offset: parseInt(props.offset || offset || 0),
      },
    };
  },
  props: ({ data: { loading, menuContent, fetchMore } }) => {
    return {
      posts: (menuContent && menuContent.posts) || [],
      total: (menuContent && menuContent.count) || 0,
      loading,
      fetchMore: variables => {
        return fetchMore({
          variables: variables,
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              menuContent: {
                count: fetchMoreResult.menuContent.count,
                posts: [
                  ...previousResult.menuContent.posts,
                  ...fetchMoreResult.menuContent.posts,
                ],
                __typename: previousResult.menuContent.__typename,
              },
            };
          },
        });
      },
    };
  },
});
