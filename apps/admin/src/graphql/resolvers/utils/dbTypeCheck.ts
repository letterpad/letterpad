// Since we support SQLITE and Myslq, we need to check the type of the database that contains the fields with type JSON.
// Prisma Sqlite does not support JSON, but MySQL does. So we need to check the type of the database and then use the correct type for the fields with type JSON.

import { NotificationMeta } from "letterpad-graphql";

import { prisma } from "@/lib/prisma";

const notificationMetaType = prisma.notifications.fields.meta["typeName"];

export const convertNotificationMetaIn = (
  meta: NotificationMeta
): typeof notificationMetaType => {
  return (
    notificationMetaType === "Json" ? meta : JSON.stringify(meta)
  ) as typeof notificationMetaType;
};

export const convertNotificationMetaOut = (meta: any): NotificationMeta => {
  return notificationMetaType === "Json" ? meta : JSON.parse(meta);
};
