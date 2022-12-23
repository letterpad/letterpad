import { PrismaClient } from "@prisma/client";

import { EmailChangeSuccessProps, EmailTemplates } from "@/graphql/types";
import logger from "@/shared/logger";

import { getEmailChangeSuccessContent } from "./content";
import { sendMail } from "../sendMail";

export async function sendVerifyUserEmail(
  data: EmailChangeSuccessProps,
  models: PrismaClient
) {
  try {
    const template = await getEmailChangeSuccessContent(data, models);
    if (template.ok) {
      await sendMail(template.content, template.meta);
    }
    return {
      ok: true,
      message: "We have sent you an email to verify your email",
    };
  } catch (e: any) {
    logger.error("Could not send mail - " + EmailTemplates.EmailChangeSuccess);
    throw e;
  }
}
