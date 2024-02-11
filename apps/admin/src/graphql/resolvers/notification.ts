import {
  MutationResolvers,
  QueryResolvers,
} from "@/__generated__/__types__";

import { convertNotificationMetaOut } from "./utils/dbTypeCheck";
import { ResolverContext } from "../context";

const Query: QueryResolvers<ResolverContext> = {
  notifications: async (_root, args, { prisma, session }) => {
    const notifications = await prisma.notifications.findMany({
      where: {
        author: {
          id: session?.user.id,
        },
      },
      take: 21,
      orderBy: { createdAt: "desc" },
    });

    return {
      __typename: "NotificationNode",
      count: notifications.length,
      rows: notifications.map((notification) => ({
        ...notification,
        meta: convertNotificationMetaOut(notification.meta),
      })),
    };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  //   addNotification: async (_, args, { prisma }) => {
  //     if (!args.data) {
  //       return {
  //         ok: false,
  //         message: "No data provided",
  //       };
  //     }
  //     await prisma.notifications.create({
  //       data: {
  //         ...args.data,
  //       },
  //     });

  //     return {
  //       ok: true,
  //     };
  //   },
  markAsRead: async (_, args, { prisma }) => {
    if (!args.notification_id) {
      return {
        ok: false,
        message: "No notification id provided",
      };
    }

    await prisma.notifications.update({
      where: {
        notification_id: args.notification_id,
      },
      data: {
        is_read: true,
      },
    });

    return {
      ok: true,
    };
  },
  markAllAsRead: async (_, args, { prisma, session }) => {
    if (!session?.user.id) {
      return {
        ok: false
      }
    }
    const notifications = await prisma.notifications.findMany({
      where: {
        author: {
          id: session?.user.id,
        },
      },
    });
    if (notifications.length > 0) {
      await prisma.notifications.updateMany({
        data: {
          is_read: true,
        },
        where: {
          notification_id: {
            in: notifications.map((n) => n.notification_id)
          }
        },
      });
    }
    return {
      ok: true,
    };
  },
};

export default { Mutation, Query };
