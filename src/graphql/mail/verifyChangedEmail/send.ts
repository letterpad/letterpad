import { PrismaClient } from "@prisma/client";

import { EmailTemplates, EmailVerifyNewEmailProps } from "@/graphql/types";
import logger from "@/shared/logger";

import { getVerifyUserEmailChangeContent } from "./content";
import { sendMail } from "../sendMail";

export async function sendVerifyUserEmail(
  data: EmailVerifyNewEmailProps,
  models: PrismaClient,
) {
  try {
    const template = await getVerifyUserEmailChangeContent(data, models);
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
