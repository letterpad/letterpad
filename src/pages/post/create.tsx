import { useRouter } from "next/router";
import { useEffect } from "react";
import CustomLayout from "../../layouts/Layout";
import { initializeApollo } from "../../graphql/apollo";
import {
  CreatePostMutation,
  CreatePostMutationVariables,
} from "../../graphql/queries/post.mutations.graphql";
import { CreatePostDocument } from "../../../__generated__/src/graphql/queries/post.mutations.graphql";
import { PostTypes } from "../../../__generated__/src/graphql/type-defs.graphqls";

const CreatePost = ({ settings, data }) => {
  const router = useRouter();
  useEffect(() => {
    router.push("/post/" + data.id);
  }, []);
  return <CustomLayout settings={settings}>Creating....</CustomLayout>;
};

export default CreatePost;

export async function getServerSideProps(context) {
  const apolloClient = initializeApollo({}, context);

  const post = await apolloClient.mutate<
    CreatePostMutation,
    CreatePostMutationVariables
  >({
    mutation: CreatePostDocument,
    variables: {
      data: { type: PostTypes.Post },
    },
  });
  return {
    props: {
      data: post.data?.createPost.post,
    },
  };
}
