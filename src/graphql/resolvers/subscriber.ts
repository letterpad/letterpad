import { MutationResolvers, QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "../apollo";
import models from "@/graphql/db/models";
import Cryptr from "cryptr";
import { enqueueEmail } from "@/mail/sendMail";
import { EmailTemplates } from "../types";
import { sendVerifySubscriberEmail } from "@/mail/emailVerifySubscriber";

const cryptr = new Cryptr(process.env.SECRET_KEY);

const Query: QueryResolvers<ResolverContext> = {
  subscribers: async (_root, _args, { session }) => {
    if (!session?.user.id) {
      return {
        count: 0,
        rows: [],
      };
    }
    const rows = await models.Subscribers.findAll({
      where: { author_id: session?.user.id },
      raw: true,
    });
    return {
      count: rows.length,
      rows,
    };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  addSubscriber: async (_, args, { author_id }) => {
    if (!author_id) {
      return {
        ok: false,
        message: "A valid owner of the blog you subscribed was not found",
      };
    }
    const author = await models.Author.findOne({ where: { id: author_id } });

    const subscribers = await author?.getSubscribers({
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
        await sendVerifySubscriberEmail({
          template_id: EmailTemplates.VERIFY_NEW_SUBSCRIBER,
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
      await author?.createSubscriber({
        email: args.email,
        verified: false,
      });
      await enqueueEmail({
        author_id,
        subscriber_email: args.email,
        template_id: EmailTemplates.VERIFY_NEW_SUBSCRIBER,
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
  updateSubscriber: async (_, args) => {
    const subscriber = await models.Subscribers.findOne({
      where: { id: cryptr.decrypt(args.data.secret_id) },
    });
    if (!subscriber) {
      return {
        ok: false,
        message: "Subscriber does not exist",
      };
    }
    await subscriber.update({
      verified: true,
      email: args.data.email || subscriber.email,
    });

    return {
      ok: true,
      message: "",
    };
  },
};

export default { Query, Mutation };
