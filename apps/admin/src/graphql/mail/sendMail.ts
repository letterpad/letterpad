import { hasCredentials, mail } from "@/lib/mail";

import { EmailTemplateMeta, Mail } from "@/graphql/types";
import logger from "@/shared/logger";

import { baseTemplate } from "./templates/base";

export async function sendMail(data: Mail, meta: EmailTemplateMeta) {
  if (!hasCredentials()) {
    return logger.debug("No client found to send emails");
  }
  const recipients = typeof data.to === "string" ? [data.to] : data.to;
  const mails = recipients.map(async (to) => {
    const body = baseTemplate
      .replace("{{ content }}", data.html)
      .replace("{{ unsubscribe_link }}", "")
      .replace("{{ signature }}", "<br><br>Cheers,<br>Letterpad Team");
    // send mail
    const fromEmail = process.env.SENDER_EMAIL;

    const response = await mail({
      from: `"Letterpad" <${fromEmail}>`,
      replyTo: `"${meta.author.name}" <${to}>`,
      to: `"${meta.author.name}" <${to}>`,
      subject: data.subject,
      html: body,
    });
    return response;
  });
  return Promise.all(mails);
}
