import { PrismaClient } from "@prisma/client";

import { DomainMapSuccessProps, EmailTemplateResponse } from "@/graphql/types";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getdomainMapSuccessContent(
  data: DomainMapSuccessProps,
  prisma: PrismaClient
): Promise<EmailTemplateResponse> {
  const template = await getTemplate(data.template_id);

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

  const subject = template.subject
    .replaceAll("{{ company_name }}", "Letterpad")
    .replaceAll("{{ domain_name }}", author?.domain.name);

  const body = template.body
    .replaceAll(
      "domain_name",
      `<a href="https://${author.domain.name}">${author.domain.name}</a>`
    )
    .replaceAll(
      "{{ company_name }}",
      `<a href="https://letterpad.app">Letterpad</a>`
    )
    .replaceAll("{{ full_name }}", author?.name);

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
