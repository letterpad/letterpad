import { EmailForgotPasswordProps, EmailTemplates } from "@/graphql/types";
import logger from "@/shared/logger";
import SendMail from "../sendMail";
import { getForgotPasswordContent } from "./content";

export async function sendForgotPasswordEmail(data: EmailForgotPasswordProps) {
  try {
    const template = await getForgotPasswordContent(data);
    if (template.ok) {
      await SendMail(template.content, template.meta);
    }
    return {
      ok: true,
      message: "We have sent you an email to recover your password",
    };
  } catch (e: any) {
    logger.error("Could not send mail - " + EmailTemplates.FORGOT_PASSWORD);
    throw new Error(e);
  }
}
