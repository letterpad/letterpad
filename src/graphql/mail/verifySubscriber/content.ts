import Twig from "twig";
import { getVerifySubscriberToken } from "@/shared/token";
import { addLineBreaks } from "../utils";
import {
  EmailTemplateResponse,
  EmailVerifySubscriberProps,
} from "@/graphql/types";
import { PrismaClient } from "@prisma/client";
import { getTemplate } from "../template";

export async function getVerifySubscriberEmailContent(
  data: EmailVerifySubscriberProps,
  prisma: PrismaClient,
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
    email: data.subscriber_email,
    author_id: data.author_id,
  });

  const href = `${process.env.ROOT_URL}/api/verify?token=${token}&subscriber=1`;

  const body = bodyTemplate.render({
    blog_name: author.setting?.site_title,
    full_name: "There",
    verify_link: `<a target="_blank" href="${href}">
        Verify Email
      </a>`,
  });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: data.subscriber_email },
    meta: {
      author,
    },
  };
}
