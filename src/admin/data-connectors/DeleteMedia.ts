import { graphql } from "@apollo/react-hoc";
import { DELETE_MEDIA } from "../../shared/queries/Mutations";

export default graphql(DELETE_MEDIA, {
  props: ({ mutate }) =>
    mutate && {
      deleteMedia: data =>
        mutate({
          variables: { ids: data.join(",") },
        }),
    },
});
