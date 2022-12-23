import { PrismaClient } from "@prisma/client";

import { DomainMapSuccessProps, EmailTemplates } from "@/graphql/types";
import logger from "@/shared/logger";

import { getdomainMapSuccessContent } from "./content";
import { sendMail } from "../sendMail";

export async function sendDomainMapSuccessEmail(
  data: DomainMapSuccessProps,
  models: PrismaClient
) {
  try {
    const template = await getdomainMapSuccessContent(data, models);
    if (template.ok) {
      await sendMail(template.content, template.meta);
    }
    return {
      ok: true,
      message: "We have sent you an email to verify your email",
    };
  } catch (e: any) {
    logger.error("Could not send mail - " + EmailTemplates.DomainMapSuccess);
    throw e;
  }
}
