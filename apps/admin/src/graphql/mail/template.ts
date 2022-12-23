import fs from "fs";
import path from "path";

import { EmailTemplates } from "../types";

const emailTemplatesDir = path.resolve(process.cwd(), "src/graphql/mail");
// eslint-disable-next-line @typescript-eslint/ban-types
const cache: Record<EmailTemplates, { body: ""; subject: "" }> | {} = {};

export function getTemplate(template: EmailTemplates): {
  body: string;
  subject: string;
} {
  if (cache[template]) return cache[template];

  const body = fs.readFileSync(
    path.join(emailTemplatesDir, `${template}/body.twig`),
    "utf-8"
  );

  const subject = fs.readFileSync(
    path.join(emailTemplatesDir, `${template}/subject.twig`),
    "utf-8"
  );
  cache[template] = { body: body.toString(), subject: subject.toString() };

  return cache[template];
}
