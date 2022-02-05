import { EmailProps, EmailTemplates } from "@/graphql/types";
import logger from "@/shared/logger";
import { getEmailTemplate } from "./templates/getTemplate";
import * as Sentry from "@sentry/nextjs";
import { getMailClient } from "./client";
import { sendMail } from "./sendMail";
import { PrismaType } from "@/lib/prisma";

const mailClient = getMailClient();

export async function enqueueEmailAndSend(
  props: EmailProps,
  prisma: PrismaType,
  restrict = false,
) {
  if (restrict) return "";
  if (!mailClient) {
    return logger.debug(
      "No client found to send emails. Terminating enqueuing Email",
    );
  }
  try {
    const found = await prisma.emailDelivery.findFirst({
      where: { ...props },
    });
    if (found) {
      return logger.debug("Email record exist. Skipping");
    }
    const newDelivery = await prisma.emailDelivery.create({
      data: {
        ...props,
        // createdAt: getDateTime(new Date()) as any,
        delivered: false,
      },
    } as any);
    logger.debug("Creating a new email record. yet to be delivered.");

    // TODO - Since we are tracking the email, we should not run it on the main thread. Instead use a child thread or an external service. Lets worry when we are worried.
    const data = await getEmailTemplate(props, prisma);

    if (data.ok) {
      const addUnsubscribe = props.template_id === EmailTemplates.NEW_POST;
      const response = await sendMail(data.content, data.meta, addUnsubscribe);
      if (response && response.length > 0) {
        if (response[0].response.res.statusCode === 200) {
          await prisma.emailDelivery.update({
            data: {
              delivered: 1,
            },
            where: { id: newDelivery.id },
          });
        }
      }
    } else {
      Sentry.captureException(new Error(data.message));
    }
  } catch (e: any) {
    Sentry.captureException(e);
  }
}
