import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { mail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

import { NotificationMeta } from "@/__generated__/__types__";
import { baseTemplate } from "@/graphql/mail/templates/base";
import { getRootUrl } from "@/shared/getRootUrl";
import { isSqliteDb } from "@/utils/utils";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const posts = await prisma.notifications.findMany({
    select: {
      meta: true,
      author_id: true,
    },
    where: {
      mail_sent: false,
    },
  });

  const notificationsArrByAuthorId: Record<number, any[]> = {};

  posts.forEach((post) => {
    if (isSqliteDb()) {
      post.meta = JSON.parse(post.meta as string);
    }
    if (!notificationsArrByAuthorId[post.author_id]) {
      notificationsArrByAuthorId[post.author_id] = [];
    }
    notificationsArrByAuthorId[post.author_id].push(post.meta);
  });

  const authorsData = await prisma.author.findMany({
    select: {
      name: true,
      email: true,
      id: true,
      username: true,
    },
    where: {
      id: {
        in: Object.keys(notificationsArrByAuthorId),
      },
    },
  });

  const authorsLookup: Record<number, (typeof authorsData)[0]> = {};
  authorsData.forEach((author) => {
    authorsLookup[author.id] = author;
  });
  const mailSentAuthorIds: string[] = [];
  const mails = Object.keys(notificationsArrByAuthorId).map(
    async (authorId) => {
      const recipient = authorsLookup[authorId];
      const updates = notificationsArrByAuthorId[authorId];
      const emailContent: string[] = [];

      updates.forEach((update: NotificationMeta) => {
        switch (update.__typename) {
          case "PostLikeMeta":
            emailContent.push(
              `👉 <a href="https://${getRootUrl()}/@${update.author_username
              }">${update.author_name}</a> liked this <a href="https://${recipient.username
              }.letterpad.app/post/${update.post_slug}">post</a> of yours.`
            );
            break;
          case "FollowerNewMeta":
            emailContent.push(
              `👉 <a href="${getRootUrl()}/@${update.follower_username}">${update.follower_name
              }</a> started following you.`
            );
            break;
        }
      });
      if (emailContent.length === 0) return;
      const verb = emailContent.length === 1 ? "an update" : "updates";
      const body = `Hello ${recipient.name
        }, <br><br>We have ${verb} for you.<br><br>${emailContent.join("<br>")}`;

      return new Promise<SMTPTransport.SentMessageInfo | void>(
        async (resolve) => {
          const html = baseTemplate
            .replaceAll("{{ content }}", body)
            .replaceAll("{{ unsubscribe_link }}", "")
            .replaceAll("{{ signature }}", "<br>Cheers, <br>Letterpad");
          const subject = `New updates on Letterpad`;
          const res = await mail(
            {
              from: `"Letterpad" <admin@letterpad.app>`,
              replyTo: `"No-Reply" <admin@letterpad.app>`,
              to: `"${recipient.name}" <${recipient.email}>`,
              subject,
              html,
            },
            false
          ).catch((_e) => {
            // eslint-disable-next-line no-console
            console.log(`Failed to send email to ${recipient.email}`);
          });
          resolve(res);
          mailSentAuthorIds.push(authorId);
        }
      );
    }
  );

  await Promise.all(mails).catch((e) => {
    // eslint-disable-next-line no-console
    console.log("Failed to send one or more emails", e);
  });
  await prisma.notifications
    .updateMany({
      where: {
        author_id: {
          in: mailSentAuthorIds,
        },
      },
      data: {
        mail_sent: true,
      },
    })
    .catch((_e) => {
      // eslint-disable-next-line no-console
      console.log(`Failed to update mail status for one or more post`);
    });

  return NextResponse.json({ success: true });
}
