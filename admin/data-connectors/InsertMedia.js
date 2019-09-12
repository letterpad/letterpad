import { graphql } from "@apollo/react-hoc";
import { INSERT_MEDIA } from "../../shared/queries/Mutations";

export default graphql(INSERT_MEDIA, {
  props: ({ mutate }) => ({
    insertMedia: data => {
      return mutate({
        variables: data,
      });
    },
  }),
});
