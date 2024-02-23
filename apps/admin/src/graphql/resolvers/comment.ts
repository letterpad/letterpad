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
        },
        parent_id: null
      },
      include: {
        replies: {
          include: {
            author: true
          }
        },
        author: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return comments
  },
}

const Mutation: MutationResolvers<ResolverContext> = {
  async deleteComment(_root, { comment_id }, { prisma, session }) {
    if (!session?.user.id) {
      return false
    }

    await prisma.comment.delete({
      where: {
        id: comment_id
      }
    });

    return true;
  },
  async createComment(_root, { parent_id, content, post_id }, { prisma, session }) {
    if (!session?.user.id) {
      return {
        message: "You must be logged in to comment",
      }
    }
    const parent = parent_id ? {
      connect: {
        id: parent_id
      }
    } : {}
    const createdComment = await prisma.comment.create({
      data: {
        post: {
          connect: {
            id: post_id
          }
        },
        content: content,
        parent,
        author: {
          connect: {
            id: session.user.id
          }
        }
      }
    });

    const comment = await prisma.comment.findUnique({
      where: {
        id: createdComment.id
      },
      include: {
        replies: {
          include: {
            author: true
          }
        },
        author: true,
      },
    });

    if (!comment) {
      return {
        message: "Comment not found"
      }
    }

    return {
      ...comment,
      __typename: "Comment"
    }

  },

  async updateComment(_root, args, { prisma, session }) {
    if (!session?.user.id) {
      return {
        message: "You must be logged in to comment",
      }
    }
    const updatedComment = await prisma.comment.update({
      where: {
        id: args.comment_id
      },
      data: {
        content: args.content
      }
    })
    const comment = await prisma.comment.findUnique({
      where: {
        id: updatedComment.id
      },
      include: {
        replies: {
          include: {
            author: true
          }
        },
        author: true,
      },
    });

    if (!comment) {
      return {
        message: "Comment not found"
      }
    }

    return comment
  },
};
export default { Query, Mutation };
