import { MutationResolvers, QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "../apollo";
import models from "../db/models";
import Cryptr from "cryptr";

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
  addSubscriber: async (_, args, { session }) => {
    const author_id = session?.user.id;
    if (!author_id) {
      return false;
    }
    const author = await models.Author.findOne({ where: { id: author_id } });

    const isValidSubscriber = author?.hasSubscriber(author_id);

    if (!isValidSubscriber) {
      return false;
    }

    try {
      await author?.createSubscriber({
        email: args.email,
        verified: false,
      });
    } catch (e) {
      console.log(e);
    }

    return true;
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
