import {
  MutationResolvers,
  QueryResolvers,
} from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";

import { convertNotificationMetaIn } from "./utils/dbTypeCheck";

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
    } : {};

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

    const [comment, existingPost] = await Promise.all([
      prisma.comment.findUnique({
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
      }),
      prisma.post.findUnique({
        where: {
          id: post_id
        },
        include: {
          author: true,
          comments: {
            where: {
              NOT: {
                author: {
                  id: session.user.id
                }
              }
            }
          }
        }
      })
    ])

    if (existingPost?.comments) {
      await Promise.all(
        existingPost.comments.map((participant) => {
          return prisma.notifications.create({
            data: {
              author_id: participant.author_id,
              meta: convertNotificationMetaIn({
                __typename: "CommentNewMeta",
                commenter_avatar: session.user.avatar,
                commenter_name: session.user.username,
                commenter_username: session.user.username,
                post_id: existingPost.id,
                post_slug: existingPost.slug,
                post_title: existingPost.title,
                post_author_username: existingPost.author?.username,
              }),
            },
          });
        })
      );
    }

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
