import models from "@/graphql/db/models";
import Twig from "twig";

import logger from "src/shared/logger";
import {
  EmailNewPostProps,
  EmailTemplateResponse,
  EmailTemplates,
} from "@/graphql/types";
import SendMail from "./sendMail";
import { addLineBreaks } from "./utils";

export async function getNewPostContent(
  data: EmailNewPostProps,
): Promise<EmailTemplateResponse> {
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
  const author = await models.Author.findOne({ where: { id: data.post_id } });
  const setting = await author?.getSetting();
  const subscribers = await author?.getSubscribers({ where: { verified: 1 } });

  if (!author || !setting) {
    return {
      ok: false,
      message: `No info found for the current blog.`,
    };
  }
  if (subscribers && subscribers.length === 0) {
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
    data: template.body.toString(),
  });

  const body = bodyTemplate.render({
    blog_name: setting?.site_title,
    full_name: "Friend",
    post_title: post?.title,
    excerpt: post?.excerpt,
    //@ts-ignore
    cover_image_link: post?.cover_image.src
      ? //@ts-ignore
        `<img src="${post?.cover_image.src}" width="100%">`
      : "",
    read_more_link: `<a target="_blank" href="${setting.site_url}${post?.slug}">Read More</a>`,
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

export async function sendNewPostEmail(data: EmailNewPostProps) {
  try {
    const template = await getNewPostContent(data);
    if (template.ok) {
      await SendMail(template.content, template.meta, true);
    }
    return {
      ok: true,
      message: "We have sent you an email with a new post update",
    };
  } catch (e) {
    logger.error("Could not send mail - " + EmailTemplates.NEW_POST);
    throw new Error(e);
  }
}
