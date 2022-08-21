import path from "path";
import Twig from "twig";

import { getUnsubscribeToken } from "@/shared/token";

export const bodyDecorator = (
  html: string,
  recipient_email: string,
  unsubscribe = false,
) => {
  const token = getUnsubscribeToken({
    email: recipient_email,
  });
  const unsubscribeUrl = `${process.env.ROOT_URL}/api/unsubscribe?token=${token}`;

  const baseTemplate = path.resolve(
    process.cwd(),
    "src/graphql/mail/templates/base.twig",
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const template = require("fs").readFileSync(baseTemplate, "utf-8");
  if (!template) {
    throw new Error("Email base template not found in sr/mail");
  }
  const bodyTemplate = Twig.twig({
    data: template.toString(),
  });

  const body = bodyTemplate.render({
    content: html,
    unsubscribe_link: unsubscribe
      ? `
                      Changed your mind about receiving our emails? You can
                      <a target="_blank" href="${unsubscribeUrl}"
                        >Unsubscribe</a
                      > at any time.
                 `
      : "",
  });
  return body;
};
