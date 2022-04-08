import Twig from "twig";
import { EmailWelcomeUserProps, EmailTemplateResponse } from "@/graphql/types";
import { addLineBreaks } from "../utils";
import { PrismaClient } from "@prisma/client";
import { getTemplate } from "../template";

export async function getWelcomeUserContent(
  data: EmailWelcomeUserProps,
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
    company_name: "Letterpad",
    full_name: author?.name,
  });

  const bodyTemplate = Twig.twig({
    data: template.body.toString(),
  });

  const body = bodyTemplate.render({
    blog_name: author.setting?.site_title,
    company_name: `<a href="https://letterpad.app">Letterpad</a>`,
    full_name: author?.name,
    blog_url: author.setting?.site_url,
  });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: author.email },
    meta: {
      author,
    },
  };
}
