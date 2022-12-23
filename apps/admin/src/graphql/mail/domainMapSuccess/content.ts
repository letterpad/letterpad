import { PrismaClient } from "@prisma/client";
import Twig from "twig";

import { DomainMapSuccessProps, EmailTemplateResponse } from "@/graphql/types";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getdomainMapSuccessContent(
  data: DomainMapSuccessProps,
  prisma: PrismaClient
): Promise<EmailTemplateResponse> {
  const template = getTemplate(data.template_id);

  const author = await prisma.author.findFirst({
    where: { id: data.author_id },
    include: {
      setting: true,
      domain: true,
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
  if (!author.domain) {
    return {
      ok: false,
      message: `No domain found for the current blog.`,
    };
  }
  const subjectTemplate = Twig.twig({
    data: template.subject,
  });

  const subject = subjectTemplate.render({
    company_name: `Letterpad`,
    domain_name: author.domain.name,
  });
  const bodyTemplate = Twig.twig({
    data: template.body.toString(),
  });

  const body = bodyTemplate.render({
    company_name: `<a href="https://letterpad.app">Letterpad</a>`,
    full_name: author.name,
    domain_name: `<a href="https://${author.domain.name}">${author.domain.name}</a>`,
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
