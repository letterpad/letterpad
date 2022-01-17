import { EmailNewPostProps, EmailTemplates } from "@/graphql/types";
import logger from "@/shared/logger";
import SendMail from "../sendMail";
import { getNewPostContent } from "./content";

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
  } catch (e: any) {
    logger.error("Could not send mail - " + EmailTemplates.NEW_POST);
    throw new Error(e);
  }
}
