import jwt from "jsonwebtoken";
import { getSession } from "next-auth/client";
import { ApolloServer } from "apollo-server-micro";
import models from "@/graphql/db/models";
import { schema } from "@/graphql/schema";

const apolloServer = new ApolloServer({
  schema,
  context: async context => {
    const authHeader = context.req?.headers.authorization || "";

    let author_id;
    try {
      console.log("context.req.headers :>> ", context.req.headers);
      const { host } = context.req.headers;
      if (host && host.includes("letterpad.app")) {
        const username = host.split(".")[0];
        const author = await models.Author.findOne({
          attributes: ["id"],
          where: { username },
        });
        if (author) author_id = author.id;
      } else if (authHeader) {
        const token = authHeader.split(/\s+/).pop() || "";
        const tokenData = jwt.verify(token, process.env.SECRET_KEY);
        author_id = tokenData.id;
      }
    } catch (e) {
      console.log("e :>> ", e);
    }

    const session = await getSession(context);

    return { ...context, models, author_id, session };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: "/api/graphql",
});
