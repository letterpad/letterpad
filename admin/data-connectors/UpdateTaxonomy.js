import { graphql } from "react-apollo";
import { UPDATE_TAXONOMY } from "../../shared/queries/Mutations";

export default graphql(UPDATE_TAXONOMY, {
  props: ({ mutate }) => ({
    updateTaxonomy: data =>
      mutate({
        variables: data,
      }),
  }),
});
