import models from "@/graphql/db/models";
import Twig from "twig";

import logger from "src/shared/logger";
import { EmailTemplates } from "@/graphql/types";
import { getToken } from "@/shared/token";
import SendMail from "./sendMail";
import { addLineBreaks } from "./utils";

interface NewPost {
  post_id: number;
  post_title?: string;
  excerpt?: string;
  cover_image?: string;
  read_more_link?: string;
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

export async function getNewPostContent(data: NewPost): Promise<Response> {
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

  if (!author || !setting) {
    return {
      ok: false,
      message: `No info found for the current blog.`,
    };
  }
  if (subscribers && subscribers.length === 0) {
    // return {
    //   ok: false,
    //   message: `No subscribers for ${setting.site_title}`,
    // };
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
    cover_image: post?.cover_image,
    read_more_link: `<a target="_blank" href="${setting.site_url}${post?.slug}">Read More</a>`,
  });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: author.email },
  };
}

export async function sendNewPostEmail(data: NewPost) {
  try {
    const template = await getNewPostContent(data);
    if (template.ok) {
      await SendMail(template.content);
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
