import { graphql } from "react-apollo";
import { UPLOAD_COVER_IMAGE } from "../../shared/queries/Mutations";

export default graphql(UPLOAD_COVER_IMAGE, {
  props: ({ mutate }) => ({
    updateFeaturedImage: data =>
      mutate({
        variables: data,
        updateQueries: {
          getPost: (prev, { mutationResult }) => {
            const coverImage = mutationResult.data.uploadFile
              ? mutationResult.data.uploadFile.post.cover_image
              : "";
            return {
              post: {
                ...prev.post,
                cover_image: coverImage,
              },
            };
          },
        },
      }),
  }),
});
