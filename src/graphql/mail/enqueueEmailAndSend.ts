import { EmailProps, EmailTemplates } from "@/graphql/types";
import logger from "@/shared/logger";
import { getEmailTemplate } from "./templates/getTemplate";

import { sendMail } from "./sendMail";
import { hasCredentials } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export async function enqueueEmailAndSend(props: EmailProps, restrict = false) {
  if (restrict) return "";
  if (!hasCredentials()) {
    return logger.debug(
      "No client found to send emails. Terminating enqueuing Email",
    );
  }
  try {
    // const found = await prisma.emailDelivery.findFirst({
    //   where: { ...props },
    // });
    // if (found) {
    //   return logger.debug("Email record exist. Skipping");
    // }
    const newDelivery = await prisma.emailDelivery.create({
      data: {
        ...props,
        // createdAt: getDateTime(new Date()) as any,
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
    throw new Error(e);
  }
}
