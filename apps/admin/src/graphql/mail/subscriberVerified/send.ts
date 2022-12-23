//@ts-nocheck
import { EmailTemplates, EmailVerifySubscriberProps } from "@/graphql/types";
import logger from "@/shared/logger";

import { getVerifySubscriberEmailContent } from "./content";
import SendMail from "../sendMail";

export async function sendVerifySubscriberEmail(
  data: EmailVerifySubscriberProps
) {
  try {
    const template = await getVerifySubscriberEmailContent(data);
    if (template.ok) {
      await SendMail(template.content, template.meta);
    }
    return {
      ok: true,
      message: "We have sent you an email to verify your email",
    };
  } catch (e: any) {
    logger.error("Could not send mail - " + EmailTemplates.VerifySubscriber);
    throw e;
  }
}
