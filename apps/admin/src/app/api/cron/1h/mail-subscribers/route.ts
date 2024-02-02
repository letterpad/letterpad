import { MailStatus } from "@prisma/client";
import type { NextRequest } from "next/server";

import { mail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { getQueuedSubscriberEmails, queueSubscribeEmails } from "@/lib/redis";

import { PostStatusOptions } from "@/__generated__/__types__";
import { getTemplate } from "@/graphql/mail/template";
import { baseTemplate } from "@/graphql/mail/templates/base";
import { EmailTemplates } from "@/graphql/types";
import { getRootUrl } from "@/shared/getRootUrl";
import { getUnsubscribeToken } from "@/shared/token";

interface Base {
  post_id: number;
  author_id: number;
  to: string;
  title: string;
  excerpt: string;
  link: string;
  author_name: string;
  site_title: string;
  cover_image: string;
}
interface Subscribers extends Base {
  subscriber_id: number;
  __typename: "Subscribers";
}

interface Followers extends Base {
  __typename: "Followers";
}

type Variables = Subscribers | Followers;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // return new Response("Unauthorized", {
    //   status: 401,
    // });
  }

  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
    where: {
      status: PostStatusOptions.Published,
      mail_status: MailStatus.ACTIVE,
    },
  });

  const emails: Variables[] = await Promise.all(
    posts.map((post) => getQueuedSubscriberEmails(post.id))
  );

  const template = await getTemplate(EmailTemplates.NewPost);

  const mails = emails.map(async (variable) => {
    const subject = template.subject.replaceAll(
      "{{ blog_name }}",
      variable.site_title
    );
    const body = template.body
      .replaceAll("{{ blog_name }}", variable.site_title)
      .replaceAll("{{ full_name }}", "Reader")
      .replaceAll("{{ post_title }}", variable.title)
      .replaceAll("{{ excerpt }}", variable.excerpt)
      .replaceAll(
        "{{ read_more_link }}",
        `<a target="_blank" class="btn" href="${variable.link}">Read More</a>`
      )
      .replaceAll(
        "{{ cover_image_link }}",
        variable.cover_image
          ? `<img src="${variable.cover_image}" width="100%">`
          : ""
      )
      .replaceAll("{{ author_name }}", variable.author_name);

    const unSubscribeLink = await getUnsubscribeText({
      recipient_email: variable.to,
      author_id: variable.author_id,
      subcriber_id:
        variable.__typename === "Subscribers" ? variable.subscriber_id : 0,
    });

    const html = baseTemplate
      .replaceAll("{{ content }}", body)
      .replaceAll("{{ unsubscribe_link }}", unSubscribeLink);

    await mail(
      {
        from: `"Letterpad" <admin@letterpad.app>`,
        replyTo: `"No-Reply" <admin@letterpad.app>`,
        bcc: `"Reader" <${variable.to}>`,
        subject,
        html,
      },
      false
    );
  });

  return Response.json({ success: true });
}

async function getUnsubscribeText({
  recipient_email,
  author_id,
  subcriber_id,
}) {
  if (subcriber_id === 0) return "";
  const token = await getUnsubscribeToken({
    email: recipient_email,
    author_id: author_id,
    subscriber_id: subcriber_id,
  });
  const unsubscribeUrl = `${getRootUrl()}/api/unsubscribe?token=${token}`;
  const unsubscribe_link = `Changed your mind about receiving our emails? You can
                      <a target="_blank" href="${unsubscribeUrl}"
                        >Unsubscribe</a
                      > at any time.
                 `;
  return unsubscribe_link;
}
