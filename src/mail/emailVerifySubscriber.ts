import models from "@/graphql/db/models";
import Twig from "twig";

import logger from "src/shared/logger";

import { getToken } from "@/shared/token";
import SendMail from "./sendMail";
import { addLineBreaks } from "./utils";

import {
  EmailTemplateResponse,
  EmailTemplates,
  EmailVerifyNewSubscriberProps,
} from "@/graphql/types";

export async function getVerifySubscriberEmailContent(
  data: EmailVerifyNewSubscriberProps,
): Promise<EmailTemplateResponse> {
  const template = await models.Email.findOne({
    where: { template_id: EmailTemplates.VERIFY_NEW_SUBSCRIBER },
  });
  if (!template) {
    return {
      ok: false,
      message: `No template found for ${EmailTemplates.VERIFY_NEW_SUBSCRIBER}`,
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
    data: { email: data.subscriber_email },
  });
  const href = `${process.env.ROOT_URL}/api/verify?token=${token}&subscriber=1`;

  const body = bodyTemplate.render({
    blog_name: setting?.site_title,
    full_name: "There",
    verify_link: `<a target="_blank" href="${href}">
        Verify Email
      </a>`,
  });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: data.subscriber_email },
    meta: {
      setting,
      author,
    },
  };
}

export async function sendVerifySubscriberEmail(
  data: EmailVerifyNewSubscriberProps,
) {
  try {
    const template = await getVerifySubscriberEmailContent(data);
    if (template.ok) {
      await SendMail(template.content, template.meta);
    }
    return {
      ok: true,
      message: "We have sent you an email to verify your email",
    };
  } catch (e) {
    logger.error(
      "Could not send mail - " + EmailTemplates.VERIFY_NEW_SUBSCRIBER,
    );
    throw new Error(e);
  }
}
