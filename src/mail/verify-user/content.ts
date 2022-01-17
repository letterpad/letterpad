import { models } from "@/graphql/db/models";
import Twig from "twig";
import {
  EmailTemplateResponse,
  EmailTemplates,
  EmailVerifyNewUserProps,
} from "@/graphql/types";
import { getToken } from "@/shared/token";
import { addLineBreaks } from "../utils";

export async function getVerifyUserEmailContent(
  data: EmailVerifyNewUserProps,
): Promise<EmailTemplateResponse> {
  const template = await models.Email.findOne({
    where: { template_id: EmailTemplates.VERIFY_NEW_USER },
  });
  if (!template) {
    return {
      ok: false,
      message: `No template found for ${EmailTemplates.VERIFY_NEW_USER}`,
    };
  }
  const author = await models.Author.findOne({
    where: { id: data.author_id },
  });

  if (!author) {
    return {
      ok: false,
      message: `No author found for the current blog.`,
    };
  }

  const setting = await author.getSetting();

  if (!setting) {
    return {
      ok: false,
      message: `No info found for the current blog.`,
    };
  }
  const subjectTemplate = Twig.twig({
    data: template.subject,
  });

  const subject = subjectTemplate.render({
    blog_name: setting?.site_title,
  });
  const bodyTemplate = Twig.twig({
    data: template.body.toString(),
  });

  const token = getToken({
    data: { email: author.email },
  });
  const href = `${process.env.ROOT_URL}/api/verify?token=${token}`;

  const body = bodyTemplate.render({
    blog_name: setting?.site_title,
    full_name: "there",
    verify_link: `<a target="_blank" href="${href}">
        Verify Email
      </a>`,
  });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: author.email },
    meta: {
      setting,
      author,
    },
  };
}
