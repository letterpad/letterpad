import { graphql } from "react-apollo";
import { UPLOAD_COVER_IMAGE } from "../../shared/queries/Mutations";

export default graphql(UPLOAD_COVER_IMAGE, {
  props: ({ mutate }) => ({
    updateFeaturedImage: data =>
      mutate({
        variables: data,
      }),
  }),
});
