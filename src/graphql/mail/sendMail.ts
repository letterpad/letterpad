import * as Sentry from "@sentry/nextjs";
import { EmailTemplateMeta, Mail } from "@/graphql/types";
import { bodyDecorator } from "./decorator";
import logger from "@/shared/logger";
import { getMailClient } from "./client";

const mailClient = getMailClient();

export function sendMail(
  data: Mail,
  meta: EmailTemplateMeta,
  addUnsubscribe: boolean = false,
): any {
  if (!mailClient) {
    return logger.debug("No client found to send emails");
  }
  const recipients = typeof data.to === "string" ? [data.to] : data.to;
  const mails = recipients.map((to) => {
    const body = bodyDecorator(data.html, to, addUnsubscribe);
    // send mail
    return mailClient
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              // the or clause is to overwrite this setting for demo purpose
              Email: process.env.SENDER_EMAIL || meta.setting.site_email,
              Name: meta.setting.site_title || "Letterpad",
            },
            To: [
              {
                Email: to,
                Name: to,
              },
            ],
            Subject: data.subject,
            HTMLPart: body,
          },
        ],
      })
      .catch((e) => {
        Sentry.captureException(e);
        return e;
      });
  });
  return Promise.all(mails);
}
