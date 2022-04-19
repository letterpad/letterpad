import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";
import { basePath } from "@/constants";
import bcrypt from "bcryptjs";
import Prisma, { prisma } from "@/lib/prisma";
import { createAuthorWithSettings, onBoardUser } from "@/lib/onboard";
import { Role } from "@/__generated__/__types__";
import { SessionData } from "@/graphql/types";
import { umamiApi, analyticsConnected } from "@/lib/umami";



const providers = (_req: NextApiRequest) => [
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
          include: {
            role: true,
          },
        });
        const permissions = await prisma.rolePermissions.findMany({
          where: {
            role_id: author?.role_id,
          },
          include: {
            permission: true,
          },
        });

        if (author) {
          if (!author.verified) {
            throw new Error("Your email id is not verified yet.");
          }
          const authenticated = await bcrypt.compare(
            credentials?.password || "",
            author.password,
          );

          if (authenticated) {
            if (!author.analytics_id && analyticsConnected) {
              try {
                const api = await umamiApi();
                const website = (await api.addWebsite(
                  author.username,
                  `${author.username}.letterpad.app`,
                )) as Record<string, any>;
                await prisma.author.update({
                  data: {
                    analytics_id: website.website_id,
                    analytics_uuid: website.website_uuid,
                  },
                  where: {
                    id: author.id,
                  },
                });
              } catch (e) {
                console.log(e);
              }
            }
            const user = {
              id: author.id,
              avatar: author.avatar,
              username: author.username,
              name: author.name,
              email: author.email,
              role: author.role.name,
              permissions: permissions.map(({ permission }) => permission),
            };
            return user;
          }
        }
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
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

const options = (req: NextApiRequest): NextAuthOptions => ({
  providers: providers(req),
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return process.env.ROOT_URL + "/posts";
    },
    jwt: async ({ token, user, account }) => {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.user = user;
        return token;
      }
      //  "user" parameter is the object received from "authorize"
      //  "token" is being send to "session" callback...
      //  ...so we set "user" param of "token" to object from "authorize"...
      //  ...and return it...
      //@ts-ignore
      token.user = user;
      return token;
    },
    session: async ({ session, token }) => {
      try {
        if (!token.email) {
          throw new Error("Invalid session");
        }
        const author = await prisma.author.findFirst({
          where: { email: token.email },
          include: {
            role: true,
          },
        });
        if (author) {
          const { id, email, username, avatar, name } = author;
          session.user = {
            id,
            email,
            username,
            name,
            avatar,
            image: avatar,
            role: author.role.name,
          } as any;
        } else {
          throw new Error("Author not found");
        }
      } catch (e) {
        if (token.email && token.name && token.sub) {
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
            session.user = {
              id: newAuthor.id,
              email: token.email,
              username: token.sub,
              name: token.name,
              avatar: token.picture,
              image: token.picture,
              role: Role.Author,
            } as any;
          }
        }
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

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options(req));
