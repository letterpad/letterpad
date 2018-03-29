import { graphql } from "react-apollo";
import { BLOG_STATS } from "../../shared/queries/Queries";

export default graphql(BLOG_STATS, {
    props: ({ data: { loading, stats } }) => ({
        stats,
        loading
    })
});
