import {
  MutationResolvers,
  QueryResolvers,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

const Query: QueryResolvers<ResolverContext> = {
  async comments(_root, args, { prisma }) {
    const comments = await prisma.comment.findMany({
      where: {
        post: {
          id: args.post_id
        }
      },
      include: {
        replies: true,
      },
    });
    return comments
  },
}

const Mutation: MutationResolvers<ResolverContext> = {
  async createComment(_root, { parent_id, content, post_id }, { prisma, session }) {
    if (!session?.user.id) {
      return {
        message: "You must be logged in to comment",
      }
    }
    const comment = await prisma.comment.create({
      data: {
        post: {
          connect: {
            id: post_id
          }
        },
        content: content,
        parent: {
          connect: {
            id: parent_id
          }
        }
      }
    })

    return comment;
  },

  async updateComment(_root, args, { prisma, session }) {
    if (!session?.user.id) {
      return {
        message: "You must be logged in to comment",
      }
    }
    const comment = await prisma.comment.update({
      where: {
        id: args.comment_id
      },
      data: {
        content: args.content
      }
    })
    return comment;
  },
};
export default { Query, Mutation };
