import Twig from "twig";
import fs from "fs";
import path from "path";
import { getToken } from "@/shared/token";
import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface Mail {
  to: string | string[];
  subject: string;
  html: string;
}

export default function SendMail(data: Mail) {
  const to = typeof data.to === "string" ? [data.to] : data.to;
  const baseTemplate = path.join(
    __dirname,
    "../../../src/mail/templates/base.twig",
  );

  const template = fs.readFileSync(baseTemplate, "utf-8");

  const bodyTemplate = Twig.twig({
    data: template.toString(),
  });
  return to.map((to) => {
    const token = getToken(to, 0);
    const unsubscribeUrl = `${process.env.ROOT_URL}/api/unsubscribe?token=${token}`;
    const body = bodyTemplate.render({
      content: data.html.replace(/(?:\r\n|\r|\n)/g, "<br>"),
      unsubscribe_link: unsubscribeUrl,
    });

    // send mail
    // sgMail.send({
    //   ...data,
    //   html: body,
    //   from: "admin@letterpad.app",
    // });

    return body;
  });
}
