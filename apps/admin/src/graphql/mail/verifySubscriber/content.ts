import { PrismaClient } from "@prisma/client";
import Twig from "twig";

import {
  EmailTemplateResponse,
  EmailVerifySubscriberProps,
} from "@/graphql/types";
import { getVerifySubscriberToken } from "@/shared/token";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getVerifySubscriberEmailContent(
  data: EmailVerifySubscriberProps,
  prisma: PrismaClient
): Promise<EmailTemplateResponse> {
  const template = getTemplate(data.template_id);
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

  const subjectTemplate = Twig.twig({
    data: template.subject,
  });

  const subject = subjectTemplate.render({
    blog_name: author.setting?.site_title,
  });

  const bodyTemplate = Twig.twig({
    data: template.body.toString(),
  });

  const token = getVerifySubscriberToken({
    email: subscriber.email,
    subscriber_id: subscriber.id,
    author_id: data.author_id,
  });

  const href = `${process.env.ROOT_URL}/api/verifySubscriber?token=${token}&subscriber=1`;

  const body = bodyTemplate.render({
    blog_name: author.setting?.site_title,
    full_name: "There",
    verify_link: `<a target="_blank" href="${href}">
        Verify Email
      </a>`,
  });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: subscriber.email },
    meta: {
      author,
    },
  };
}
