import jwt from "jsonwebtoken";
import { getSession } from "next-auth/client";
import { ApolloServer } from "apollo-server-micro";
import models from "@/graphql/db/models";
import { schema } from "@/graphql/schema";

const apolloServer = new ApolloServer({
  schema,
  context: async context => {
    const authHeader = context.req?.headers.authorization || "";
    const token = authHeader.split(/\s+/).pop() || "";
    let author_id = {};

    try {
      const tokenData = jwt.verify(token, process.env.SECRET_KEY);
      console.log("tokenData :>> ", tokenData);
      author_id = tokenData.id;
    } catch (e) {
      console.log("veify failed");
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
