import { PrismaClient } from "@prisma/client";

import { EmailTemplateResponse, EmailWelcomeUserProps } from "@/graphql/types";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getWelcomeUserContent(
  data: EmailWelcomeUserProps,
  prisma: PrismaClient
): Promise<EmailTemplateResponse> {
  const template = await getTemplate(data.template_id);
  const author = await prisma.author.findFirst({
    where: { id: data.author_id },
    include: {
      setting: true,
    },
  });

  const site_url = `https://${author?.username}.letterpad.app`;

  if (!author) {
    return {
      ok: false,
      message: `No info found for the current blog.`,
    };
  }

  const subject = template.subject
    .replaceAll("{{ company_name }}", "Letterpad")
    .replaceAll("{{ full_name }}", author?.name);

  const body = template.body
    .replaceAll("{{ blog_name }}", author.setting?.site_title ?? "")
    .replaceAll("{{ company_name }}", `<a href="https://letterpad.app">Letterpad</a>`)
    .replaceAll("{{ full_name }}", author?.name)
    .replaceAll("{{ blog_url }}", author.setting?.site_url ?? site_url);

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: author.email },
    meta: {
      author,
    },
  };
}
