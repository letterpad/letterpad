import { EmailNewPostProps, EmailTemplates } from "@/graphql/types";
import logger from "@/shared/logger";
import { sendMail } from "../sendMail";
import { getNewPostContent } from "./content";

export async function sendNewPostEmail(data: EmailNewPostProps, models) {
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
