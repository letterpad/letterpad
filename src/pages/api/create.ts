import { NextApiResponse } from "next";
import { NextApiRequestWithFormData } from "./../../graphql/types";
import { basePath } from "@/constants";
import { PostTypes } from "@/__generated__/__types__";
import { getResolverContext } from "@/graphql/context";
import { createPost } from "@/graphql/resolvers/post.mutation";

const Create = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  try {
    const type = req.query.type as PostTypes;

    const context = await getResolverContext({ req, res });
    const result = await createPost({ data: { type } }, context);

    if (result) {
      //@ts-ignore
      res.redirect(basePath + "/post/" + result.id);
      return;
    }
    res.send("Post creation failed");
  } catch (e) {
    //@ts-ignore
    res.send(e.message);
  }
};

export default Create;
