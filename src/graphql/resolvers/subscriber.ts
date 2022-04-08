import { decodeToken } from "@/shared/token";
import { MutationResolvers, QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "../context";
import { enqueueEmailAndSend } from "../mail/enqueueEmailAndSend";
import { EmailTemplates } from "../types";

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
    } catch (e) {}
    return {
      count: 0,
      rows: [],
    };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  addSubscriber: async (_, args, { author_id, prisma }) => {
    if (!author_id) {
      return {
        ok: false,
        message: "A valid owner of the blog you subscribed was not found",
      };
    }

    const subscribers = await prisma.subscriber.findMany({
      where: { email: args.email, author_id },
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
          author_id,
          subscriber_email: args.email,
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
      await prisma.subscriber.create({
        data: {
          email: args.email,
          verified: false,
          author: {
            connect: {
              id: author_id,
            },
          },
        },
      });

      await enqueueEmailAndSend({
        author_id,
        subscriber_email: args.email,
        template_id: EmailTemplates.VerifySubscriber,
      });
    } catch (e) {
      console.log(e);
    }

    return {
      ok: true,
      message:
        "You have been subscribed to this blog. An email has been sent to your email address for verification.",
    };
  },
  updateSubscriber: async (_, args, { prisma }) => {
    const decodedToken = decodeToken(args.data?.secret_id || "");
    if (!decodedToken) {
      return {
        ok: false,
        message: "Invalid token",
      };
    }

    const subscriber = await prisma?.subscriber.findFirst({
      where: { email: decodedToken.email },
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
