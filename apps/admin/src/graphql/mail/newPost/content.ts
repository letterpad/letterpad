import { PrismaClient } from "@prisma/client";

import { EmailNewPostProps, EmailTemplateResponse } from "@/graphql/types";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";

export async function getNewPostContent(
  data: EmailNewPostProps,
  prisma: PrismaClient
): Promise<EmailTemplateResponse> {
  const template = await getTemplate(data.template_id);
  const post = await prisma.post.findFirst({
    where: { id: data.post_id },
    include: {
      author: {
        include: {
          setting: true,
          subscribers: true,
        },
      },
    },
  });

  if (!post || !post.author) {
    return {
      ok: false,
      message: `No info found for the current blog.`,
    };
  }

  if (post.author.subscribers.length === 0) {
    return {
      ok: false,
      message: `No subscribers for ${post.author.setting?.site_title}`,
    };
  }

  const subject = template.subject.replaceAll(
    "blog_name",
    post.author.setting?.site_title ?? ""
  );

  const body = template.body
    .replaceAll("blog_name", post.author.setting?.site_title ?? "")
    .replaceAll("full_name", "Letterpad User")
    .replaceAll("post_title", post?.title)
    .replaceAll("excerpt", post?.excerpt)
    .replaceAll(
      "read_more_link",
      `<a target="_blank" class="btn" href="${post.author.setting?.site_url}/${post?.type}/${post?.slug}">Read More</a>`
    )
    .replaceAll(
      "cover_image_link",
      post?.cover_image ? `<img src="${post?.cover_image}" width="100%">` : ""
    )
    .replaceAll("author_name", post.author.name);

  return {
    ok: true,
    content: {
      subject,
      html: addLineBreaks(body),
      to: post.author.subscribers.map(({ email, id }) => ({ email, id })),
    },
    meta: {
      author: post.author,
    },
  };
}
