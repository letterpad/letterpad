import Twig from "twig";
import fs from "fs";
import path from "path";

interface Mail {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export default function SendMail(data: Mail) {
  const baseTemplate = path.join(
    __dirname,
    "../../../src/mail/templates/base.twig",
  );

  const template = fs.readFileSync(baseTemplate, "utf-8");

  const bodyTemplate = Twig.twig({
    data: template.toString(),
  });
  const body = bodyTemplate.render({
    content: data.html.replace(/(?:\r\n|\r|\n)/g, "<br>"),
  });

  return body;
}
