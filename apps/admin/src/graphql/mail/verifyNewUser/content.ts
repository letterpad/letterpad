import { PrismaClient } from "@prisma/client";
import Twig from "twig";

import {
  EmailTemplateResponse,
  EmailVerifyNewUserProps,
} from "@/graphql/types";
import { getVerifyUserToken } from "@/shared/token";
import { getRootUrl } from "@/shared/utils";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getVerifyUserEmailContent(
  data: EmailVerifyNewUserProps,
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
    company_name: `Letterpad`,
  });
  const bodyTemplate = Twig.twig({
    data: template.body.toString(),
  });

  const token = getVerifyUserToken({
    author_id: author.id,
    email: author.email,
  });
  const href = `${getRootUrl()}/api/verify?token=${token}`;

  const body = bodyTemplate.render({
    company_name: `<a href="https://letterpad.app">Letterpad</a>`,
    full_name: author.name,
    verify_link: `<a target="_blank" href="${href}">
        Verify Email
      </a>`,
  });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: author.email },
    meta: {
      author: {
        ...author,
        social: JSON.parse(author.social),
      },
    },
  };
}
