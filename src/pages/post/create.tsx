import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomLayout from "../../layouts/Layout";
import { initializeApollo } from "../../graphql/apollo";
import {
  CreatePostMutation,
  CreatePostMutationVariables,
} from "../../graphql/queries/post.mutations.graphql";
import { CreatePostDocument } from "@/__generated__/queries/post.mutations.graphql";
import { PostTypes } from "@/__generated__/type-defs.graphqls";
import {
  CreatePostResponse,
  Setting,
} from "@/__generated__/queries/queries.graphql";
import ErrorMessage from "../../components/ErrorMessage";

interface IProps {
  data: CreatePostResponse;
  settings: Setting;
}

const CreatePost = ({ settings, data }: IProps) => {
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (data.__typename === "Post") {
      router.push("/post/" + data.id);
    }
    if (data.__typename === "PostError") {
      setError(data.message);
    }
  }, []);

  if (error) {
    return <ErrorMessage description={error} title="Error in create Post" />;
  }

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
      data: post.data?.createPost,
    },
  };
}
