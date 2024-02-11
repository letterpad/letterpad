import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

import { report } from "@/components/error";
import { createAuthorWithSettings } from "@/components/onboard";

import { RegisterStep } from "@/__generated__/__types__";
import { basePath } from "@/constants";
import { getRootUrl } from "@/shared/getRootUrl";
import { isPasswordValid } from "@/utils/bcrypt";

import { isBlackListed } from "./blacklist";
import { getAuthCookieName } from "../../../utils/authCookie";

const { host, protocol } = new URL(process.env.ROOT_URL);
const useSecureCookies = protocol === "https:";

const providers = (): NextAuthOptions["providers"] => [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  }),
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials): Promise<any> => {
      try {
        if (isBlackListed(credentials?.email!)) {
          return Promise.reject(
            new Error("Your email domain has been blacklisted.")
          );
        }
        const author = await prisma.author.findFirst({
          where: { email: credentials?.email },
        });
        if (author) {
          if (!author.verified) {
            return Promise.reject(
              new Error("Your email id is not verified yet.")
            );
          }
          const authenticated = await isPasswordValid(
            credentials?.password || "",
            author.password
          );
          return authenticated
            ? author
            : Promise.reject(
                new Error("Incorrect password. Please try again.")
              );
        } else {
          return Promise.reject(
            new Error("The email you provided is not registered.")
          );
        }
      } catch (e: any) {
        report.error(e);
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2021") {
            return Promise.reject(
              new Error("Database is not ready. Run `yarn seed` from terminal.")
            );
          }
        }
      }
    },
  }),
];

export const options = (): NextAuthOptions => ({
  providers: providers(),
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return getRootUrl(baseUrl) + "/posts";
    },
    jwt: async ({ token, trigger, session, user }) => {
      if (trigger === "update") {
        return { ...token, user: { ...session.user } };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (!token.email) {
        throw new Error("Invalid session");
      }
      let author = await prisma.author.findFirst({
        where: { email: token.email },
        include: {
          role: true,
        },
      });

      try {
        // If the user logins with google or github, create their letterpad account
        if (!author && token.sub && token.name) {
          const newAuthor = await createAuthorWithSettings(
            {
              email: token.email,
              name: token.name,
              avatar: token.picture || "",
              username: token.sub,
              password: "",
              token: "",
              verified: true,
              register_step: RegisterStep.ProfileInfo,
              login_type: token.provider as string,
            },
            {
              site_email: token.email,
            }
          );
          author = await prisma.author.findFirst({
            where: { email: token.email },
            include: {
              role: true,
            },
          });
        }

        if (author) {
          const { id, email, username, avatar, name, register_step } = author;
          session.user = {
            id,
            email,
            username,
            name,
            avatar,
            image: avatar,
            role: author.role.name,
            register_step,
          } as any;
        }
      } catch (e: any) {
        report.error(e);
        throw new Error("Could not create a valid session");
      }

      const ses = session;
      if (author && ses.user) {
        //update the session data
        ses.user.username = author.username;
        ses.user.avatar = author.avatar;
        ses.user.name = author.name;
        ses.user.register_step = author.register_step as RegisterStep;
      }
      return ses;
    },
  },
  jwt: {
    secret: process.env.SECRET_KEY,
  },
  pages: {
    signIn: `${basePath}/login`,
  },
  secret: process.env.SECRET_KEY,
  cookies: {
    sessionToken: {
      name: getAuthCookieName(),
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: `.${host}`,
        secure: useSecureCookies,
      },
    },
  },
});

const auth = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options());

export default auth;
