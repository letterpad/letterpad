import {
  LoginDocument,
  LoginMutation,
  LoginMutationVariables,
} from "@/__generated__/queries/mutations.graphql";
import { LoginResponse } from "@/__generated__/__types__";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getApolloClient } from "@/graphql/apollo";
import { NextApiRequest, NextApiResponse } from "next";
import { basePath } from "@/constants";
``;
const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials, req): Promise<LoginResponse> => {
      const apolloClient = await getApolloClient({}, { req: req.headers });
      const result = await apolloClient.mutate<
        LoginMutation,
        LoginMutationVariables
      >({
        mutation: LoginDocument,
        variables: {
          data: {
            email: credentials?.email || "",
            password: credentials?.password || "",
          },
        },
      });

      if (result.data?.login?.__typename === "Author") {
        return {
          ...result.data.login,
          accessToken: credentials && credentials["csrfToken"],
        };
      }

      if (result.data?.login?.__typename === "LoginError") {
        return result.data.login;
      }

      return {
        __typename: "LoginError",
        message:
          "We are facing issues logging you in. Please try after sometime",
      };
    },
  }),
];

const options = {
  providers,
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return process.env.ROOT_URL + "/posts";
    },
    jwt: async ({ token, ...rest }) => {
      //  "user" parameter is the object received from "authorize"
      //  "token" is being send to "session" callback...
      //  ...so we set "user" param of "token" to object from "authorize"...
      //  ...and return it...
      const { user } = rest;
      if (user && token && user.__typename === "Author") {
        token.role = user.role;
        token.avatar = user.avatar;
        token.permissions = user.permissions;
        token.id = user.id;
        token.username = user.username;
        token.__typename = "SessionData";
      }
      return token;
    },
    session: async ({ session, token }) => {
      console.log("before checking session");
      session.user = token;
      console.log("Checking session...");
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
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
