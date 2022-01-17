import { models } from "@/graphql/db/models";
import Twig from "twig";
import {
  EmailForgotPasswordProps,
  EmailTemplateResponse,
  EmailTemplates,
} from "@/graphql/types";
import { getToken } from "@/shared/token";
import { addLineBreaks } from "../utils";

export async function getForgotPasswordContent(
  data: EmailForgotPasswordProps,
): Promise<EmailTemplateResponse> {
  const template = await models.Email.findOne({
    where: { template_id: EmailTemplates.FORGOT_PASSWORD },
  });
  if (!template) {
    return {
      ok: false,
      message: `No template found for ${EmailTemplates.FORGOT_PASSWORD}`,
    };
  }
  const author = await models.Author.findOne({
    where: { id: data.author_id },
  });
  const setting = await author?.getSetting();

  if (!author || !setting) {
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
  const href = `${process.env.ROOT_URL}/resetPassword?token=${token}`;

  const body = bodyTemplate.render({
    blog_name: setting?.site_title,
    full_name: author?.name,
    change_password_link: `<a target="_blank"  href="${href}">Change Password</a>`,
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
