import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";
import { basePath } from "@/constants";
import { models } from "@/graphql/db/models";
import bcrypt from "bcryptjs";

const providers = (_req: NextApiRequest) => [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials): Promise<any> => {
      try {
        const author = await models.Author.findOne({
          where: { email: credentials?.email },
        });
        const rawAuthor = author?.get();
        if (rawAuthor) {
          if (!author?.verified) {
            throw new Error("Your email id is not verified yet.");
          }
          const authenticated = await bcrypt.compare(
            credentials?.password || "",
            author.password,
          );
          if (authenticated) {
            const role = await author.getRole();
            // const permissions = await role.getPermissions();
            const user = {
              id: rawAuthor.id,
              avatar: rawAuthor.avatar,
              username: rawAuthor.username,
              name: rawAuthor.name,
              email: rawAuthor.email,
              role: role.get(),
              // permissions: permissions.get(),
            };
            return user;
          }
        }
      } catch (e) {
        console.error(e);
      }
      throw Error("next-auth - internal error");
    },
  }),
];

const options = (req: NextApiRequest) => ({
  providers: providers(req),
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return process.env.ROOT_URL + "/posts";
    },
    jwt: async ({ token, user }) => {
      //  "user" parameter is the object received from "authorize"
      //  "token" is being send to "session" callback...
      //  ...so we set "user" param of "token" to object from "authorize"...
      //  ...and return it...
      token.user = user;
      return token;
    },
    session: async ({ session, token }) => {
      try {
        const author = await models.Author.findByPk(token.sub);
        if (author) {
          const { id, email, username, avatar, name } = author?.get();
          session.user = { id, email, username, name, avatar };
        }
      } catch (e) {
        console.log(e);
      }
      return session;
    },
  },
  jwt: {
    encryption: true,
    secret: process.env.SECRET_KEY,
    signingKey: process.env.SECRET_KEY,
  },
  pages: {
    signIn: `${basePath}/login`,
  },
  secret: process.env.SECRET_KEY,
});

export default (req: NextApiRequest, res: NextApiResponse) =>
  //@ts-ignore
  NextAuth(req, res, options(req));
