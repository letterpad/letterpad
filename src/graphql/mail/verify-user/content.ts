import Twig from "twig";
import {
  EmailTemplateResponse,
  EmailTemplates,
  EmailVerifyNewUserProps,
} from "@/graphql/types";
import { getToken } from "@/shared/token";
import { addLineBreaks } from "../utils";
import { PrismaClient } from "@prisma/client";

export async function getVerifyUserEmailContent(
  data: EmailVerifyNewUserProps,
  prisma: PrismaClient,
): Promise<EmailTemplateResponse> {
  const template = await prisma.email.findOne({
    where: { template_id: EmailTemplates.VERIFY_NEW_USER },
  });
  if (!template) {
    return {
      ok: false,
      message: `No template found for ${EmailTemplates.VERIFY_NEW_USER}`,
    };
  }
  const author = await prisma.author.findFirst({
    where: { id: data.author_id },
    include: {
      setting: true,
    },
  });

  if (!author) {
    return {
      ok: false,
      message: `No author found for the current blog.`,
    };
  }

  if (!author.setting) {
    return {
      ok: false,
      message: `No info found for the current blog.`,
    };
  }
  const subjectTemplate = Twig.twig({
    data: template.subject,
  });

  const subject = subjectTemplate.render({
    blog_name: author.setting.site_title,
  });
  const bodyTemplate = Twig.twig({
    data: template.body.toString(),
  });

  const token = getToken({
    data: { email: author.email, id: author.id },
  });
  const href = `${process.env.ROOT_URL}/api/verify?token=${token}`;

  const body = bodyTemplate.render({
    blog_name: author.setting.site_title,
    full_name: "there",
    verify_link: `<a target="_blank" href="${href}">
        Verify Email
      </a>`,
  });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: author.email },
    meta: {
      author,
    },
  };
}
