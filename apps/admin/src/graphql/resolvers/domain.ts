import { MutationResolvers, QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import logger from "@/shared/logger";

import { enqueueEmailAndSend } from "../mail/enqueueEmailAndSend";
import { getDomain, removeDomain } from "../services/domain";
import { EmailTemplates } from "../types";

import { Optional } from "@/types";

const Query: Optional<QueryResolvers<ResolverContext>> = {
  domain: async (_root, _args, context) => {
    return getDomain(_args, context);
  },
  certs: async (_root, _args, { session, prisma }) => {
    if (!session?.user) {
      return false;
    }
    const domain = await prisma.domain.findFirst({
      where: { author_id: session.user.id },
    });
    if (!domain?.name) return false;

    const https = require("https");
    const validate = new Promise((resolve, reject) => {
      https
        .get(`https://${domain.name}`, (res) => {
          if (res.headers.server === "Vercel") {
            resolve(true);
          } else {
            reject(false);
          }
        })
        .on("error", (_e) => {
          reject(false);
        });
    });
    try {
      return await validate;
    } catch (_e) {
      return false;
    }
  },
};

const Mutation: Optional<MutationResolvers<ResolverContext>> = {
  addDomain: async (_, { domain }, context) => {
    if (!context.session?.user || !domain) {
      return {
        ok: false,
        message: "No session found",
      };
    }

    const response = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        body: `{"name": "${domain}"}`,
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );

    const data = await response.json();
    if (data.error?.code == "forbidden") {
      return {
        __typename: "DomainError",
        message: "Forbidden",
      };
    } else if (data.error?.code == "domain_taken") {
      return {
        __typename: "DomainError",
        message: "Domain is taken",
      };
    } else if (data.error?.code == "domain_already_in_use") {
      return {
        __typename: "DomainError",
        message: "Domain is already in use",
      };
    }

    const dbResponse = await context.prisma.domain.upsert({
      create: {
        name: domain.trim(),
        ssl: false,
        mapped: data.verified,
        author: {
          connect: {
            id: context.session.user.id,
          },
        },
      },
      update: {
        ssl: false,
        mapped: data.verified,
        name: domain.trim(),
      },
      where: {
        author_id: context.session.user.id,
      },
    });
    // await enqueueEmailAndSend({
    //   author_id: context.session.user.id,
    //   template_id: EmailTemplates.DomainMapSuccess,
    // });
    return {
      __typename: "Domain",
      ...dbResponse,
      verification: data.verification,
      configured: !data.misconfigured,
    };
  },
  removeDomain: async (_, _args, context) => {
    return removeDomain(_args, context);
  },
};

export default { Query, Mutation };
