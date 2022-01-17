import { EmailTemplates, EmailVerifyNewUserProps } from "@/graphql/types";
import logger from "@/shared/logger";
import SendMail from "../sendMail";
import { getVerifyUserEmailContent } from "./content";

export async function sendVerifyUserEmail(data: EmailVerifyNewUserProps) {
  try {
    const template = await getVerifyUserEmailContent(data);
    if (template.ok) {
      await SendMail(template.content, template.meta);
    }
    return {
      ok: true,
      message: "We have sent you an email to verify your email",
    };
  } catch (e: any) {
    logger.error("Could not send mail - " + EmailTemplates.VERIFY_NEW_USER);
    throw e;
  }
}
