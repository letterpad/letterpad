import { PrismaClient } from "@prisma/client";
import Twig from "twig";

import {
  EmailTemplateResponse,
  PasswordChangeSuccessProps,
} from "@/graphql/types";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getPasswordChangeSuccessContent(
  data: PasswordChangeSuccessProps,
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

  const body = bodyTemplate.render({
    company_name: `<a href="https://letterpad.app">Letterpad</a>`,
    full_name: author.name,
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
