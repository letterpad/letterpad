import { EmailTemplates, PasswordChangeSuccessProps } from "@/graphql/types";
import logger from "@/shared/logger";

import { getPasswordChangeSuccessContent } from "./content";
import { sendMail } from "../sendMail";

export async function sendVerifyUserEmail(
  data: PasswordChangeSuccessProps,
  models,
) {
  try {
    const template = await getPasswordChangeSuccessContent(data, models);
    if (template.ok) {
      await sendMail(template.content, template.meta);
    }
    return {
      ok: true,
      message: "We have sent you an email to verify your email",
    };
  } catch (e: any) {
    logger.error(
      "Could not send mail - " + EmailTemplates.PasswordChangeSuccess,
    );
    throw e;
  }
}
