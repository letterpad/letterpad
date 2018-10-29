import { graphql } from "react-apollo";
import { DELETE_TAXONOMY } from "../../shared/queries/Mutations";

export default graphql(DELETE_TAXONOMY, {
  props: ({ mutate }) => ({
    deleteTaxonomy: data =>
      mutate({
        variables: data,
      }),
  }),
});
