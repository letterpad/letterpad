import Twig from "twig";
import {
  EmailForgotPasswordProps,
  EmailTemplateResponse,
  EmailTemplates,
} from "@/graphql/types";
import { getForgotPasswordToken } from "@/shared/token";
import { addLineBreaks } from "../utils";
import { PrismaClient } from "@prisma/client";

export async function getForgotPasswordContent(
  data: EmailForgotPasswordProps,
  prisma: PrismaClient,
): Promise<EmailTemplateResponse> {
  const template = await prisma.email.findFirst({
    where: { template_id: EmailTemplates.FORGOT_PASSWORD },
  });
  if (!template) {
    return {
      ok: false,
      message: `No template found for ${EmailTemplates.FORGOT_PASSWORD}`,
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
