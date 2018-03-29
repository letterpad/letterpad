import { graphql } from "react-apollo";
import { GET_LATEST_PUBLISHED_POSTS } from "../queries/Queries";

export default graphql(GET_LATEST_PUBLISHED_POSTS, {
    options: props => ({
        variables: {
            type: "post",
            limit: parseInt(props.settings.sidebar_latest_post_count.value)
        }
    }),
    props: ({ data: { loading, posts } }) => ({
        posts,
        ploading: loading
    })
});
