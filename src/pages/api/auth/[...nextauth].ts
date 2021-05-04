import {
  LoginDocument,
  LoginMutation,
  LoginMutationVariables,
} from "@/__generated__/queries/mutations.graphql";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { initializeApollo } from "@/graphql/apollo";
import { SessionData } from "@/graphql/types";
import { NextApiRequest, NextApiResponse } from "next";

const providers = [
  Providers.Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async credentials => {
      const apolloClient = await initializeApollo({});

      const result = await apolloClient.mutate<
        LoginMutation,
        LoginMutationVariables
      >({
        mutation: LoginDocument,
        variables: {
          data: {
            email: credentials.email,
            password: credentials.password,
          },
        },
      });

      if (result && result.data) {
        return {
          ...result.data.login?.data,
          accessToken: credentials.csrfToken,
        };
      }
      return {};
    },
  }),
];

const options = {
  providers,
  callbacks: {
    redirect: async (url: string, baseUrl: string) => {
      console.log("url :>> ", url);
      console.log("basseUrl :>> ", baseUrl);
      return url.startsWith(baseUrl)
        ? Promise.resolve(url)
        : Promise.resolve(process.env.ROOT_URL + "/posts");
    },
    jwt: async (token: any, user: Required<SessionData["user"]>) => {
      //  "user" parameter is the object received from "authorize"
      //  "token" is being send to "session" callback...
      //  ...so we set "user" param of "token" to object from "authorize"...
      //  ...and return it...
      if (user && token) {
        token.role = user.role;
        token.avatar = user.avatar;
        token.permissions = user.permissions;
        token.id = user.id;
      }
      return Promise.resolve(token);
    },
    session: async (session: any, user: SessionData["user"]) => {
      session.user = user;

      return Promise.resolve(session);
    },
  },
  jwt: {
    encryption: true,
    secret: process.env.SECRET_KEY,
  },
  pages: {
    // signIn: "/login",
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
