import { EmailTemplates, EmailVerifyNewUserProps } from "@/graphql/types";
import logger from "@/shared/logger";
import { sendMail } from "../sendMail";
import { getVerifyUserEmailContent } from "./content";

export async function sendVerifyUserEmail(
  data: EmailVerifyNewUserProps,
  models,
) {
  try {
    const template = await getVerifyUserEmailContent(data, models);
    if (template.ok) {
      await sendMail(template.content, template.meta);
    }
    return {
      ok: true,
      message: "We have sent you an email to verify your email",
    };
  } catch (e: any) {
    logger.error("Could not send mail - " + EmailTemplates.VerifyNewUser);
    throw e;
  }
}
