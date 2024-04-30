import { hasCredentials } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

import { report } from "@/components/error";

import { EmailProps } from "@/graphql/types";
import logger from "@/shared/logger";

import { sendMail } from "./sendMail";
import { getEmailTemplate } from "./templates/getTemplate";

export async function enqueueEmailAndSend(props: EmailProps) {
  if (!hasCredentials()) {
    return logger.debug(
      "No client found to send emails. Terminating enqueuing Email"
    );
  }
  try {
    logger.debug("Creating a new email record. yet to be delivered.");

    const data = await getEmailTemplate(props, prisma);

    if (data?.ok) {
      await sendMail(data.content, data.meta);
    } else {
      throw new Error(data?.message);
    }
  } catch (e: any) {
    report.error(e);
  }
}
