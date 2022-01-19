import Twig from "twig";

import {
  EmailNewPostProps,
  EmailTemplateResponse,
  EmailTemplates,
} from "@/graphql/types";
import { addLineBreaks } from "../utils";

export async function getNewPostContent(
  data: EmailNewPostProps,
  models,
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

  const postRaw = await models.Post.findOne({ where: { id: data.post_id } });
  const post = postRaw.get();
  const author = await models.Author.findOne({
    where: { id: post?.author_id },
  });
  const setting = await author?.getSetting();
  const subscribers = await author?.getSubscribers({ where: { verified: 1 } });

  if (!author || !setting) {
    return {
      ok: false,
      message: `No info found for the current blog.`,
    };
  }

  if (!subscribers || subscribers.length === 0) {
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
    cover_image_link: post?.cover_image?.src
      ? `<img src="${post?.cover_image.src}" width="100%">`
      : "",
    read_more_link: `<a target="_blank" href="${setting.site_url}${post?.slug}">Read More</a>`,
  });

  return {
    ok: true,
    content: {
      subject,
      html: addLineBreaks(body),
      to: subscribers?.map((s) => s.email),
    },
    meta: {
      setting,
      author,
    },
  };
}
