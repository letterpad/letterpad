import { graphql } from "@apollo/react-hoc";
import { UPDATE_OPTIONS } from "../../shared/queries/Mutations";

export default graphql(UPDATE_OPTIONS, {
  props: ({ mutate }) => {
    if (!mutate) return null;
    return {
      updateOptions: data =>
        mutate({
          variables: { options: data },
        }),
    };
  },
});
