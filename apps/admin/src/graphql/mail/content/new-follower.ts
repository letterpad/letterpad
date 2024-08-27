import { PrismaClient } from "@prisma/client";

import { EmailTemplateResponse, NewFollowerProps } from "@/graphql/types";
import { getRootUrl } from "@/shared/getRootUrl";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";
import {
  replaceBodyVariables,
} from "../variables";

export async function getNewFollowerContent(
  data: NewFollowerProps,
  prisma: PrismaClient
): Promise<EmailTemplateResponse> {

  const template = await getTemplate(data.template_id);
  const author = await prisma.author.findMany({
    where: {
      id: {
        in: [data.follower_id, data.following_id],
      },
    },
    include: {
      setting: true,
    },
  });
  const follower = author.find((a) => a.id === data.follower_id);
  const following = author.find((a) => a.id === data.following_id);

  const subject = template.subject;

  const body = replaceBodyVariables(template.body, {
    follower_name: follower?.name!,
    following_name: following?.name!,
    follower_profile_link: `${getRootUrl()}/@${follower?.username}`,
  })

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: following?.email! },
    meta: {
      author: following!,
    },
  };
}
