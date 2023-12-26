import { PrismaClient } from "@prisma/client";

import {
  EmailTemplateResponse,
  EmailVerifyNewEmailProps,
} from "@/graphql/types";
import { getRootUrl } from "@/shared/getRootUrl";
import { getVerifyUserToken } from "@/shared/token";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getVerifyUserEmailChangeContent(
  data: EmailVerifyNewEmailProps,
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
      message: `No author found for the current blog.`,
    };
  }

  if (!author.setting) {
    return {
      ok: false,
      message: `No info found for the current blog.`,
    };
  }

  const token = getVerifyUserToken({
    author_id: author.id,
    email: author.email,
  });
  const href = `${getRootUrl()}/api/verify?token=${token}`;

  const subject = template.subject.replaceAll("company_name", "Letterpad");

  const body = template.body
    .replaceAll(
      "verify_link",
      `<a target="_blank" href="${href}">
        Verify Email
      </a>`
    )
    .replaceAll("company_name", `<a href="https://letterpad.app">Letterpad</a>`)
    .replaceAll("full_name", author?.name);

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
