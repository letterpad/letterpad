import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { RegisterStep, Role } from "letterpad-graphql";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import PrismaClient, { prisma } from "@/lib/prisma";

import { basePath } from "@/constants";
import { getRootUrl } from "@/shared/getRootUrl";

import { isBlackListed } from "./blacklist";

const providers = (): NextAuthOptions["providers"] => [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    allowDangerousEmailAccountLinking: true,
  }),
  GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    allowDangerousEmailAccountLinking: true,
  }),
  EmailProvider({
    server: {
      host: process.env.SMTP_HOST!,
      port: 465,
      auth: {
        user: process.env.SMTP_USERNAME!,
        pass: process.env.SMTP_PASSWORD!,
      },
    },
    from: process.env.SENDER_EMAIL!,
  }),
];

const authPrisma = {
  account: prisma.account,
  user: prisma.author,
  session: prisma.session,
  verificationToken: prisma.verificationRequest,
} as unknown as PrismaClient

export const options = (): NextAuthOptions => ({
  providers: providers(),
  adapter: PrismaAdapter(authPrisma),
  events: {
    createUser: async ({ user }) => {
      if (!user.email) return;
      await prisma.author.update({
        where: { email: user.email },
        data: {
          avatar: user.image,
          register_step: RegisterStep.ProfileInfo,
          role: {
            connect: {
              name: Role.Author
            }
          }
        },

      })
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const author = await prisma.author.findUnique({
          where: { email: user.email },
          include: { role: true, membership: true },
        });
        if (author) {
          token.id = author.id;
          token.email = author.email;
          token.username = author.username;
          token.name = author.name;
          token.avatar = author.avatar;
          token.role = author.role?.name;
          token.membership = author.membership?.status ?? "free";
          token.can_start_trial = !!!author.membership?.status;
          token.register_step = author.register_step;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        ...session.user,
        ...token,
        register_step: token.register_step as RegisterStep,
        membership: token.membership as any,
      }
      return session;
    },
    async signIn({ user, email }) {
      if (user.email) {
        if (isBlackListed(user.email)) {
          return false;
        }
      }
      return true;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return new URL("/posts", getRootUrl()).toString();
    },
  },
  jwt: {
    secret: process.env.SECRET_KEY,
  },
  pages: {
    signIn: `${basePath}/login`,
  },
  secret: process.env.SECRET_KEY,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

const auth = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options());

export default auth;