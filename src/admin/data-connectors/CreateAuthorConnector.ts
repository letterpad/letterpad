import { graphql } from "@apollo/react-hoc";
import { CREATE_AUTHOR } from "../../shared/queries/Mutations";

export default graphql(CREATE_AUTHOR, {
  props: ({ mutate }) =>
    mutate && {
      createAuthor: data =>
        mutate({
          variables: data,
        }),
    },
});
