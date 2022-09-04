import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { createAuthorWithSettings, onBoardUser } from "@/lib/onboard";
import { prisma } from "@/lib/prisma";
import { addUmamAnalyticsiIfNotExists } from "@/lib/umami";

import { report } from "@/components/error";

import { basePath } from "@/constants";
import { SessionData } from "@/graphql/types";

const providers = (): NextAuthOptions["providers"] => [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials): Promise<any> => {
      try {
        const author = await prisma.author.findFirst({
          where: { email: credentials?.email },
        });
        if (author) {
          if (!author.verified) {
            throw new Error("Your email id is not verified yet.");
          }
          const authenticated = await bcrypt.compare(
            credentials?.password || "",
            author.password,
          );
          return authenticated ? author : null;
        }
      } catch (e) {
        report.error(e);
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2021") {
            throw new Error(
              "Database is not ready. Run `yarn seed` from terminal.",
            );
          }
        }
      }
    },
  }),
];

const options = (): NextAuthOptions => ({
  providers: providers(),
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return process.env.ROOT_URL + "/posts";
    },
    jwt: async ({ token }) => {
      return token;
    },
    session: async ({ session, token }) => {
      try {
        if (!token.email) {
          throw new Error("Invalid session");
        }
        await addUmamAnalyticsiIfNotExists(token.email);
        const author = await prisma.author.findFirst({
          where: { email: token.email },
        });

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
              login_type: token.provider as string,
            },
            {
              site_title: token.name,
              site_email: token.email,
            },
          );
          if (newAuthor) {
            await onBoardUser(newAuthor.id);
          }
        }

        const finalAuthor = await prisma.author.findFirst({
          where: { email: token.email },
          include: {
            role: true,
          },
        });

        if (finalAuthor) {
          const { id, email, username, avatar, name } = finalAuthor;
          session.user = {
            id,
            email,
            username,
            name,
            avatar,
            image: avatar,
            role: finalAuthor.role.name,
          } as any;
        }
      } catch (e) {
        report.error(e);
        throw new Error("Could not create a valid session");
      }
      return session as { user: SessionData; expires: any };
    },
  },
  jwt: {
    secret: process.env.SECRET_KEY,
  },
  pages: {
    signIn: `${basePath}/login`,
  },
  secret: process.env.SECRET_KEY,
});

const auth = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options());

export default auth;
