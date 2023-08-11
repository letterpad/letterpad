import { NextApiResponse } from "next";

import { PostTypes } from "@/__generated__/__types__";
import { getResolverContext } from "@/graphql/context";
import { createPost } from "@/graphql/services/post";

import { NextApiRequestWithFormData } from "./../../graphql/types";

const Create = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) => {
  try {
    const type = req.query.type as PostTypes;
    const page_type = req.query.page_type as string;
    const context = await getResolverContext({ req });
    const result = await createPost({ data: { type, page_type } }, context);
    return res.json(result);
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export default Create;
