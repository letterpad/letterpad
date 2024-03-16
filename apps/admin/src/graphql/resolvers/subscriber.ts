import { MutationResolvers, QueryResolvers } from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import logger from "@/shared/logger";
import { decodeJWTToken } from "@/shared/token";

import { enqueueEmailAndSend } from "../mail/enqueueEmailAndSend";
import { EmailTemplates } from "../types";
import { isValidEmail } from "../../utils/utils";

import { VerifySubscriberToken } from "@/types";

const Query: QueryResolvers<ResolverContext> = {
  subscribers: async (_root, _args, { session, prisma }) => {
    if (!session?.user.id) {
      return {
        count: 0,
        rows: [],
      };
    }
    try {
      const subscribers = await prisma.subscriber.findMany({
        where: { author_id: session.user.id },
      });
      return {
        count: subscribers.length,
        rows: subscribers,
      };
    } catch (e: any) {
      logger.error(e);
    }
    return {
      count: 0,
      rows: [],
    };
  },
  subscriber: async (_root, args, { session, prisma }) => {
    if (!session?.user.id) {
      return { message: "Invalid Session" };
    }
    try {
      const subscriber = await prisma.subscriber.findFirst({
        where: { id: args.subscriber_id },
      });
      if (subscriber) return subscriber;
    } catch (e: any) {
      logger.error(e);
    }
    return {
      message: "Subscriber not found",
    };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  addSubscriber: async (_, args, { client_author_id, prisma }) => {
    if (!client_author_id) {
      return {
        ok: false,
        message: "A valid owner of the blog you subscribed was not found",
      };
    }
    if (!isValidEmail(args.email)) {
      return {
        ok: false,
        message: "Invalid email",
      };
    }
    const subscribers = await prisma.subscriber.findMany({
      where: { email: args.email, author_id: client_author_id },
    });
    if (subscribers && subscribers.length > 0) {
      if (!subscribers[0].verified) {
        if (subscribers[0].verify_attempt_left === 0) {
          return {
            ok: false,
            message: "No more attempts left.",
          };
        }

        await enqueueEmailAndSend({
          template_id: EmailTemplates.VerifySubscriber,
          author_id: client_author_id,
          subscriber_id: subscribers[0].id,
        });

        return {
          ok: false,
          message:
            "The email you used already exist but has not been verified. We have just sent you an email to verify.",
        };
      }
      return {
        ok: false,
        message: "The email you used to subscribe to this blog already exist",
      };
    }

    try {
      const response = await prisma.subscriber.create({
        data: {
          email: args.email,
          verified: false,
          author: {
            connect: {
              id: client_author_id,
            },
          },
        },
      });

      await enqueueEmailAndSend({
        author_id: client_author_id,
        subscriber_id: response.id,
        template_id: EmailTemplates.VerifySubscriber,
      });
    } catch (e: any) {
      logger.error(e);
    }

    return {
      ok: true,
      message:
        "You have been subscribed to this blog. An email has been sent to your email address for verification.",
    };
  },
  updateSubscriber: async (_, args, { prisma }) => {
    const decodedToken = decodeJWTToken<VerifySubscriberToken>(
      args.data?.secret_id || ""
    );
    if (!decodedToken) {
      return {
        ok: false,
        message: "Invalid token",
      };
    }

    const subscriber = await prisma?.subscriber.findFirst({
      where: {
        author_id: decodedToken.author_id,
        id: decodedToken.subscriber_id,
      },
    });
    if (!subscriber) {
      return {
        ok: false,
        message: "Subscriber does not exist",
      };
    }
    await prisma.subscriber.update({
      data: { verified: true },
      where: {
        id: subscriber.id,
      },
    });

    return {
      ok: true,
      message: "",
    };
  },
};

export default { Query, Mutation };
