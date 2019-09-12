import { graphql } from "@apollo/react-hoc";
import { BLOG_STATS } from "../../shared/queries/Queries";

export default graphql(BLOG_STATS, {
  props: ({ data: { loading, stats } }) => ({
    stats,
    loading,
  }),
});
