import { EmailProps, EmailTemplates } from "@/graphql/types";
import logger from "@/shared/logger";
import { getDateTime } from "@/shared/utils";
import { getEmailTemplate } from "./templates/getTemplate";
import * as Sentry from "@sentry/nextjs";
import { getMailClient } from "./client";
import { sendMail } from "./sendMail";

const mailClient = getMailClient();

export async function enqueueEmail(props: EmailProps, models) {
  if (!mailClient) {
    return logger.debug(
      "No client found to send emails. Terminating enqueuing Email",
    );
  }
  try {
    const found = await models.EmailDelivery.findOne({
      where: { ...props },
    });
    if (found) {
      return logger.debug("Email record exist. Skipping");
    }
    await models.EmailDelivery.create({
      ...props,
      createdAt: getDateTime(new Date()) as any,
      delivered: false,
    } as any);

    // TODO - Since we are tracking the email, we should not run it on the main thread. Instead use a child thread or an external service. Lets worry when we are worried.
    const data = await getEmailTemplate(props, models);

    if (data.ok) {
      const addUnsubscribe = props.template_id === EmailTemplates.NEW_POST;
      const response = await sendMail(data.content, data.meta, addUnsubscribe);
      if (response && response.length > 0) {
        if (response[0].response.res.statusCode === 200) {
          // update delivery
          await models.EmailDelivery.update(
            { delivered: true },
            { where: { ...props } },
          );
        }
      }
    } else {
      console.log(data);
      Sentry.captureException(new Error(data.message));
    }
  } catch (e: any) {
    Sentry.captureException(e);
  }
}
