import { NextApiResponse } from "next";
import { NextApiRequestWithFormData } from "./../../graphql/types";
import { basePath } from "@/constants";
import { getApolloClient } from "@/graphql/apollo";
import {
  CreatePostDocument,
  CreatePostMutation,
  CreatePostMutationVariables,
} from "@/__generated__/queries/mutations.graphql";
import { PostTypes } from "@/__generated__/__types__";

const Create = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  try {
    const type = req.query.type as PostTypes;
    const apolloClient = await getApolloClient({}, { req });

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
      res.redirect(basePath + "/post/" + post.data.createPost.id);
      return;
    }
    res.send("Post creation failed");
  } catch (e) {
    res.send(e.message);
  }
};

export default Create;
