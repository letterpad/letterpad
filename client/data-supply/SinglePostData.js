import { graphql } from "react-apollo";
import { GET_POST_BY_SLUG } from "../../shared/queries/Queries";

export default graphql(GET_POST_BY_SLUG, {
    options: props => {
        return {
            variables: {
                type: "post",
                slug: props.match.params.slug
            }
        };
    },
    props: ({ data: { loading, post } }) => ({
        post,
        loading
    })
});
