import { hasCredentials } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

import { report } from "@/components/error";

import { EmailProps, EmailTemplates } from "@/graphql/types";
import logger from "@/shared/logger";

import { sendMail } from "./sendMail";
import { getEmailTemplate } from "./templates/getTemplate";

export async function enqueueEmailAndSend(props: EmailProps) {
  if (!hasCredentials()) {
    return logger.debug(
      "No client found to send emails. Terminating enqueuing Email",
    );
  }
  try {
    const newDelivery = await prisma.emailDelivery.create({
      data: {
        ...props,
        delivered: 0,
      },
    } as any);
    logger.debug("Creating a new email record. yet to be delivered.");

    // TODO - Since we are tracking the email, we should not run it on the main thread. Instead use a child thread or an external service. Lets worry when we are worried.
    const data = await getEmailTemplate(props, prisma);

    if (data.ok) {
      const addUnsubscribe = props.template_id === EmailTemplates.NewPost;
      const response = await sendMail(data.content, data.meta, addUnsubscribe);
      if (response && response.length > 0) {
        if (response[0].response.indexOf("OK") > 0) {
          await prisma.emailDelivery.update({
            data: {
              delivered: 1,
            },
            where: { id: newDelivery.id },
          });
        }
      }
    } else {
      throw new Error(data?.message);
    }
  } catch (e: any) {
    report.error(e);
  }
}
