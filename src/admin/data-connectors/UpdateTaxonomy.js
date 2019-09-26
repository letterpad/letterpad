import { graphql } from "@apollo/react-hoc";
import { UPDATE_TAXONOMY } from "../../shared/queries/Mutations";

export default graphql(UPDATE_TAXONOMY, {
  props: ({ mutate }) => ({
    updateTaxonomy: data =>
      mutate({
        variables: data,
      }),
  }),
});
