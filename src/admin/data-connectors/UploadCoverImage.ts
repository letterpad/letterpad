import { graphql } from "@apollo/react-hoc";
import { UPLOAD_COVER_IMAGE } from "../../shared/queries/Mutations";

export default graphql(UPLOAD_COVER_IMAGE, {
  props: ({ mutate }) => {
    if (!mutate) return false;
    return {
      updateFeaturedImage: data => {
        return mutate({
          variables: data,
        });
      },
    };
  },
});
