import { PrismaClient } from "@prisma/client";

import { EmailForgotPasswordProps, EmailTemplates } from "@/graphql/types";
import logger from "@/shared/logger";

import { getForgotPasswordContent } from "./content";
import { sendMail } from "../sendMail";

export async function sendForgotPasswordEmail(
  data: EmailForgotPasswordProps,
  prisma: PrismaClient,
) {
  try {
    const template = await getForgotPasswordContent(data, prisma);
    if (template.ok) {
      await sendMail(template.content, template.meta);
    }
    return {
      ok: true,
      message: "We have sent you an email to recover your password",
    };
  } catch (e: any) {
    logger.error("Could not send mail - " + EmailTemplates.ForgotPassword);
    throw e;
  }
}
