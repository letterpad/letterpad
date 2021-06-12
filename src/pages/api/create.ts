import { NextApiResponse } from "next";
import { NextApiRequestWithFormData } from "./../../graphql/types";
import nextConfig from "next.config";
import { initializeApollo } from "@/graphql/apollo";
import {
  CreatePostDocument,
  CreatePostMutation,
  CreatePostMutationVariables,
} from "@/__generated__/queries/mutations.graphql";
import { PostTypes } from "@/__generated__/type-defs.graphqls";

const Create = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  try {
    const type = req.query.type;
    const apolloClient = await initializeApollo({}, { req });

    const post = await apolloClient.mutate<
      CreatePostMutation,
      CreatePostMutationVariables
    >({
      mutation: CreatePostDocument,
      variables: {
        data: { type: type as PostTypes },
      },
    });
    if (post.data?.createPost.__typename === "Post") {
      res.redirect(nextConfig.basePath + "/post/" + post.data.createPost.id);
      return;
    }
    res.send("Post creation failed");
  } catch (e) {
    res.send(e.message);
  }
};

export default Create;
