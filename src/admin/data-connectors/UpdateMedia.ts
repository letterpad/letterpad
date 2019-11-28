import { graphql } from "@apollo/react-hoc";
import { UPDATE_MEDIA } from "../../shared/queries/Mutations";

export default graphql(UPDATE_MEDIA, {
  props: ({ mutate }) =>
    mutate && {
      updateMedia: data =>
        mutate({
          variables: data,
        }),
    },
});
