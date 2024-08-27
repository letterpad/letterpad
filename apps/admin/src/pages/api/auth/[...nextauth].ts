import { PrismaAdapter } from "@next-auth/prisma-adapter";
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
import { sendMail } from "../../../graphql/mail/sendMail";

function emailSender(callbackUrl: string) {
  return async ({ identifier, url }) => {
    try {
      const emailVerificationLink = new URL(url);
      emailVerificationLink.searchParams.set("callbackUrl", callbackUrl);
      const res = await sendMail({
        to: identifier,
        subject: "Sign in to Letterpad",
        html: `<p>Click the below button to verify your email address and to login.</p> <a href="${emailVerificationLink.toString()}" class="btn">Verify and Login</a>`,
      });
      // eslint-disable-next-line no-console
      console.log(res);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Could not send email for passwordless", error);
    }
  };
}

const providers = (req?: NextApiRequest): NextAuthOptions["providers"] => [
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
    sendVerificationRequest: req && emailSender(req.body.callbackUrl),
  }),
];

const authPrisma = {
  account: prisma.account,
  user: prisma.author,
  session: prisma.session,
  verificationToken: prisma.verificationRequest,
} as unknown as PrismaClient;

export const options = (req?: NextApiRequest): NextAuthOptions => ({
  providers: providers(req),
  adapter: PrismaAdapter(authPrisma),
  events: {
    createUser: async ({ user }) => {
      if (!user.email) return;
      const author = await prisma.author.findFirst({
        where: {
          email: user.email,
        },
      });
      await prisma.author.update({
        where: { email: user.email },
        data: {
          avatar: author?.avatar ?? user.image,
          register_step: RegisterStep.ProfileInfo,
          role: {
            connect: {
              name: Role.Author,
            },
          },
        },
      });
    },
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session };
      }
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
      };

      return session;
    },
    async signIn({ user }) {
      if (user.email) {
        if (isBlackListed(user.email)) {
          return false;
        }
      }
      return true;
    },
    redirect: async ({ url, baseUrl }) => {
      const callback = getCallbackUrl(url);
      if (callback) {
        return callback;
      }

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
  NextAuth(req, res, options(req));

export default auth;

function getCallbackUrl(url: string) {
  const queryString = url.split("?")[1];
  const params = new URLSearchParams(queryString);
  const encodeCallbackUrl = params.get("callbackUrl");
  const callbackUrl = encodeCallbackUrl
    ? decodeURIComponent(encodeCallbackUrl)
    : null;
  return callbackUrl;
}
