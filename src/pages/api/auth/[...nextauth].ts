import { Author, LoginResponse } from "@/__generated__/__types__";
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
        if (author) {
          // if (!author?.verified) {
          //   throw new Error("Your email id is not verified yet.");
          // }
          const authenticated = await bcrypt.compare(
            credentials?.password || "",
            author.get().password,
          );
          if (authenticated) {
            const role = await author.getRole();
            const permissions = []; //author.getPermissions();
            const data = {
              user: {
                id: author.id,
                avatar: author.avatar,
                username: author.username,
                email: author.email,
                role,
                permissions,
              },
              accessToken: credentials && credentials["csrfToken"],
            };
            return data;
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
    jwt: async (d) => {
      //  "user" parameter is the object received from "authorize"
      //  "token" is being send to "session" callback...
      //  ...so we set "user" param of "token" to object from "authorize"...
      //  ...and return it...
      const { token, ...user } = d;
      if (user && token) {
        token.role = 1;
        token.avatar = user.avatar;
        token.permissions = user.permissions;
        token.id = 2;
        token.username = user.username;
        token.__typename = "SessionData";
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token;
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
  NextAuth(req, res, options(req));
