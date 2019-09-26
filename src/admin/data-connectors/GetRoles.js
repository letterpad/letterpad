import { graphql } from "@apollo/react-hoc";
import { GET_ROLES } from "../../shared/queries/Queries";

export default graphql(GET_ROLES, {
  props: ({ data: { loading, roles } }) => ({
    roles,
    loading,
  }),
});
