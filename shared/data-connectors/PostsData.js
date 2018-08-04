import { graphql } from "react-apollo";
import { CAT_POSTS } from "../../shared/queries/Queries";
import config from "../../config";

export default graphql(CAT_POSTS, {
    options: props => {
        let offset =
            props.match.params.page_no == 1 ? 0 : props.match.params.page_no;
        return {
            variables: {
                type: "post_category",
                slug: props.slug || props.match.params.slug,
                postType: "post",
                limit: props.limit || config.itemsPerPage,
                offset: props.offset || offset || 0
            },
            fetchPolicy: "network-only"
        };
    },
    props: ({ data: { loading, postsMenu, fetchMore } }) => {
        return {
            posts: (postsMenu && postsMenu.posts) || [],
            total: (postsMenu && postsMenu.count) || 0,
            loading,
            fetchMore: variables => {
                return fetchMore({
                    variables: variables,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return {
                            postsMenu: {
                                count: fetchMoreResult.postsMenu.count,
                                posts: [
                                    ...previousResult.postsMenu.posts,
                                    ...fetchMoreResult.postsMenu.posts
                                ],
                                __typename: previousResult.postsMenu.__typename
                            }
                        };
                    }
                });
            }
        };
    }
});
