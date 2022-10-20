import { PrismaClient } from "@prisma/client";
import Twig from "twig";

import {
  EmailForgotPasswordProps,
  EmailTemplateResponse,
} from "@/graphql/types";
import { getForgotPasswordToken } from "@/shared/token";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getForgotPasswordContent(
  data: EmailForgotPasswordProps,
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
  });

  const bodyTemplate = Twig.twig({
    data: template.body.toString(),
  });

  const token = getForgotPasswordToken({
    email: author.email,
  });
  const href = `${process.env.ROOT_URL}/resetPassword?token=${token}`;

  const body = bodyTemplate.render({
    blog_name: author.setting?.site_title,
    company_name: `<a href="https://letterpad.app">Letterpad</a>`,
    full_name: author?.name,
    change_password_link: `<a target="_blank"  href="${href}">Change Password</a>`,
  });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: author.email },
    meta: {
      author,
    },
  };
}
