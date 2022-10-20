import { PrismaClient } from "@prisma/client";

import { EmailTemplates, EmailWelcomeUserProps } from "@/graphql/types";
import logger from "@/shared/logger";

import { getWelcomeUserContent } from "./content";
import { sendMail } from "../sendMail";

export async function sendForgotPasswordEmail(
  data: EmailWelcomeUserProps,
  prisma: PrismaClient,
) {
  try {
    const template = await getWelcomeUserContent(data, prisma);
    if (template.ok) {
      await sendMail(template.content, template.meta);
    }
    return {
      ok: true,
      message: "We have sent you an email to recover your password",
    };
  } catch (e: any) {
    logger.error("Could not send mail - " + EmailTemplates.WelcomeUser);
    throw e;
  }
}
