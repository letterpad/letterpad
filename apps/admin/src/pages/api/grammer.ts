import { NextApiResponse } from "next";

import { NextApiRequestWithFormData } from "@/graphql/types";

const analyse = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) => {
  const body = JSON.parse(req.body);
  const text = await fetch(process.env.LANGUAGE_TOOL_URL, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: `language=en-US&text=${body.text}`,
  }).then((res) => res.json());
  res.send(text);
};

export default analyse;
