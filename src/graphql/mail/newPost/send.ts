import { PrismaClient } from "@prisma/client";

import { EmailNewPostProps, EmailTemplates } from "@/graphql/types";
import logger from "@/shared/logger";

import { getNewPostContent } from "./content";
import { sendMail } from "../sendMail";

export async function sendNewPostEmail(
  data: EmailNewPostProps,
  models: PrismaClient,
) {
  try {
    const template = await getNewPostContent(data, models);
    if (template.ok) {
      await sendMail(template.content, template.meta, true);
    }
    return {
      ok: true,
      message: "We have sent you an email with a new post update",
    };
  } catch (e: any) {
    logger.error("Could not send mail - " + EmailTemplates.NewPost);
    throw e;
  }
}
