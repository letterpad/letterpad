import {
  LoginDocument,
  LoginQuery,
  LoginQueryVariables,
} from "./../../../__generated__/lib/queries/queries.graphql";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { initializeApollo } from "../../../lib/apollo";
import models from "../../../db/models";

const providers = [
  Providers.Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async credentials => {
      const apolloClient = initializeApollo({}, { models: models });

      const result = await apolloClient.query<LoginQuery, LoginQueryVariables>({
        query: LoginDocument,
        variables: {
          data: {
            email: credentials.email,
            password: credentials.password,
          },
        },
      });

      return (
        { ...result.data.login?.data, accessToken: credentials.csrfToken } || {}
      );
    },
  }),
];

const options = {
  providers,
  // callbacks,
  jwt: {
    encryption: true,
    secret: "mmm",
  },
};

export default (req, res) => NextAuth(req, res, { ...options, theme: "light" });
