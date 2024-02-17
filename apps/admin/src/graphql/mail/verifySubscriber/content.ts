import { PrismaClient } from "@prisma/client";

import {
  EmailTemplateResponse,
  EmailVerifySubscriberProps,
} from "@/graphql/types";
import { getRootUrl } from "@/shared/getRootUrl";
import { getVerifySubscriberToken } from "@/shared/token";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getVerifySubscriberEmailContent(
  data: EmailVerifySubscriberProps,
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

  const subject = template.subject.replaceAll(
    "{{ blog_name }}",
    author.setting?.site_title ?? ""
  );

  const token = await getVerifySubscriberToken({
    email: subscriber.email,
    subscriber_id: subscriber.id,
    author_id: data.author_id,
  });

  const href = `${getRootUrl()}/api/verifySubscriber?token=${token}&subscriber=1`;

  const body = template.body
    .replaceAll("{{ blog_name }}", author.setting?.site_title ?? "")
    .replaceAll("{{ full_name }}", "There")
    .replaceAll(
      "{{ verify_link }}",
      `<a target="_blank" href="${href}">
        Verify Email
      </a>`
    );

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: subscriber.email },
    meta: {
      author,
    },
  };
}
