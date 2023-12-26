import { PrismaClient } from "@prisma/client";

import {
  EmailSubscriberVerifiedProps,
  EmailTemplateResponse,
} from "@/graphql/types";
import { getRootUrl } from "@/shared/getRootUrl";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getSubscriberVerifiedEmailContent(
  data: EmailSubscriberVerifiedProps,
  prisma: PrismaClient
): Promise<EmailTemplateResponse> {
  const template = await getTemplate(data.template_id);
  const author = await prisma.author.findFirst({
    where: { id: data.author_id },
    include: {
      setting: true,
    },
  });

  if (!author) {
    return {
      ok: false,
      message: `No info found for the current blog.`,
    };
  }

  const subscriber = await prisma.subscriber.findFirst({
    where: { id: data.subscriber_id },
  });

  if (!subscriber) {
    return {
      ok: false,
      message: `No info found for subscriber. Check if the record exist`,
    };
  }

  const myURL = new URL(getRootUrl());

  const href = `${myURL.protocol}//${author.username}.${myURL.hostname}`;

  const subject = template.subject.replaceAll(
    "blog_name",
    author.setting?.site_title ?? ""
  );

  const body = template.body
    .replaceAll("blog_name", author.setting?.site_title ?? "")
    .replaceAll(
      "site_url",
      `<a target="_blank" href="${href}">
        Visit ${author.setting?.site_title}
      </a>`
    )
    .replaceAll("full_name", author?.name);

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: subscriber.email },
    meta: {
      author,
    },
  };
}
