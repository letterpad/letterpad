import models from "@/graphql/db/models";
import sgMail from "@sendgrid/mail";

import Twig from "twig";

import logger from "src/shared/logger";
import { EmailTemplates } from "@/graphql/types";
import { getToken } from "@/shared/utils";
import SendMail from "./sendMail";
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface ForgotPassword {
  author_id: number;
  change_password_link?: string;
}

interface NewPost {
  post_id: number;
  post_title?: string;
  excerpt?: string;
  cover_image?: string;
  read_more_link?: string;
}
interface VerifyNewUser {
  author_id: number;
  verify_link?: string;
}
interface VerifyNewSubscriber {
  author_id: number;
  subscriber_email: string;
  verify_link?: string;
}

export async function sendForgotPasswordEmail(data: ForgotPassword) {
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
    data: template.body,
  });

  const token = getToken(author.email);
  const href = `${process.env.ROOT_URL}/resetPassword?token=${token}`;

  const body = bodyTemplate.render({
    blog_name: setting?.site_title,
    full_name: author?.name,
    change_password_link: `<a href="${href}">Change Password</a>`,
  });

  try {
    return await SendMail({
      from: "letterpad@ajaxtown.com",
      subject,
      html: body,
      to: author?.email,
    });
    return {
      ok: true,
      message: "We have sent you an email to recover your password",
    };
  } catch (e) {
    logger.error("Could not send mail - " + EmailTemplates.FORGOT_PASSWORD);
  }
  return {
    ok: false,
    message: `Could not send mail - ${EmailTemplates.FORGOT_PASSWORD}`,
  };
}

export async function sendVerifyUserEmail(data: VerifyNewUser) {
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

  const setting = await author.getSetting({ logging: console.log });

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
    verify_link: `<a href="${href}">
        Verify Email
      </a>`,
  });

  try {
    return await SendMail({
      from: "letterpad@ajaxtown.com",
      subject,
      html: body,
      to: author?.email,
    });
  } catch (e) {
    logger.error("Could not send mail - " + EmailTemplates.FORGOT_PASSWORD);
  }
}

export async function newPostEmail(data: NewPost) {
  const template = await models.Email.findOne({
    where: { template_id: EmailTemplates.NEW_POST },
  });
  if (!template) {
    return {
      ok: false,
      message: `No template found for ${EmailTemplates.NEW_POST}`,
    };
  }

  const post = await models.Post.findOne({ where: { id: data.post_id } });
  const author = await post?.getAuthor();
  const setting = await author?.getSetting();
  const subscribers = await author?.getSubscribers();

  if (!author || !setting || !subscribers) {
    return {
      ok: false,
      message: `No info found for the current blog.`,
    };
  }
  if (subscribers.length === 0) {
    return {
      ok: false,
      message: `No subscribers for ${setting.site_title}`,
    };
  }
  const subjectTemplate = Twig.twig({
    data: template.subject,
  });

  const subject = subjectTemplate.render({
    blog_name: setting?.site_title,
  });

  const bodyTemplate = Twig.twig({
    data: template.body,
  });
  const body = bodyTemplate.render({
    blog_name: setting?.site_title,
    full_name: "Friend",
    post_title: post?.title,
    excerpt: post?.excerpt,
    cover_image: post?.cover_image,
  });

  try {
    return await SendMail({
      from: "letterpad@ajaxtown.com",
      subject,
      html: body,
      to: subscribers.map((subs) => subs.email),
    });
  } catch (e) {
    logger.error("Could not send mail - " + EmailTemplates.FORGOT_PASSWORD);
  }
}

export async function sendVerifySubscriberEmail(data: VerifyNewSubscriber) {
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
    data: template.body,
  });

  const token = getToken(author.email);
  const href = `${process.env.ROOT_URL}/api/verify?token=${token}&subscriber=1`;

  const body = bodyTemplate.render({
    blog_name: setting?.site_title,
    full_name: author?.name,
    verify_link: `<a href="${href}">
        Verify Email
      </a>`,
  });

  try {
    return await SendMail({
      from: "letterpad@ajaxtown.com",
      subject,
      html: body,
      to: author?.email,
    });
  } catch (e) {
    logger.error("Could not send mail - " + EmailTemplates.FORGOT_PASSWORD);
  }
}
