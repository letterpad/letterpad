import models from "@/graphql/db/models";
import Twig from "twig";

import logger from "src/shared/logger";
import { EmailTemplates } from "@/graphql/types";
import { getToken } from "@/shared/token";
import SendMail from "./sendMail";
import { addLineBreaks } from "./utils";

interface VerifyNewUser {
  author_id: number;
  verify_link?: string;
}

interface ResponseSuccess {
  ok: true;
  content: {
    subject: string;
    html: string;
    to: string | string[];
  };
}
interface ResponseFailure {
  ok: false;
  message: string;
}

type Response = ResponseSuccess | ResponseFailure;

export async function getVerifyUserEmailContent(
  data: VerifyNewUser,
): Promise<Response> {
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

  const token = getToken(author.email);
  const href = `${process.env.ROOT_URL}/api/verify?token=${token}`;

  const body = bodyTemplate.render({
    blog_name: setting?.site_title,
    full_name: author?.name,
    verify_link: `<a target="_blank" href="${href}">
        Verify Email
      </a>`,
  });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: author.email },
  };
}

export async function sendVerifyUserEmail(data: VerifyNewUser) {
  try {
    const template = await getVerifyUserEmailContent(data);
    if (template.ok) {
      await SendMail(template.content);
    }
    return {
      ok: true,
      message: "We have sent you an email to verify your email",
    };
  } catch (e) {
    logger.error("Could not send mail - " + EmailTemplates.VERIFY_NEW_USER);
    throw new Error(e);
  }
}
