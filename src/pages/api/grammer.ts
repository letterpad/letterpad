import { NextApiRequestWithFormData } from "@/graphql/types";
import { NextApiResponse } from "next";

const analyse = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  const body = JSON.parse(req.body);
  const text = await fetch("http://localhost:8010/v2/check", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: `language=en-US&text=${body.text}`,
  }).then((res) => res.json());
  res.send(text);
};

export default analyse;
