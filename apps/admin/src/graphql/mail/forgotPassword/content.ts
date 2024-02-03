import { PrismaClient } from "@prisma/client";

import {
  EmailForgotPasswordProps,
  EmailTemplateResponse,
} from "@/graphql/types";
import { getRootUrl } from "@/shared/getRootUrl";
import { getForgotPasswordToken } from "@/shared/token";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getForgotPasswordContent(
  data: EmailForgotPasswordProps,
  prisma: PrismaClient
): Promise<EmailTemplateResponse> {
  const template = await getTemplate(data.template_id);
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

  const subject = template.subject.replaceAll(
    "{{ company_name }}",
    "Letterpad"
  );

  const token = await getForgotPasswordToken({
    email: author.email,
  });
  const href = `${getRootUrl()}/resetPassword?token=${token}`;

  const body = template.body
    .replaceAll("{{ blog_name }}", author.setting?.site_title ?? "")
    .replaceAll(
      "{{ company_name }}",
      `<a href="https://letterpad.app">Letterpad</a>`
    )
    .replaceAll("{{ full_name }}", author?.name)
    .replaceAll(
      "{{ change_password_link }}",
      `<a target="_blank"  href="${href}">Change Password</a>`
    );

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: author.email },
    meta: {
      author,
    },
  };
}
