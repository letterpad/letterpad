import { graphql } from "@apollo/react-hoc";
import { GET_TAXONOMIES } from "../../shared/queries/Queries";

export default graphql(GET_TAXONOMIES, {
  options: (props: any) => {
    return {
      variables: {
        type: props.type || "post_category",
      },
      forceFetch: true,
      fetchPolicy: "network-only",
    };
  },
  props: ({ data: { loading, taxonomies, networkStatus } }: any) => ({
    taxonomies,
    loading,
    networkStatus,
  }),
});
