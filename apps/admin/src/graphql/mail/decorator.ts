import path from "path";
import Twig from "twig";

import { getUnsubscribeToken } from "@/shared/token";
import { getRootUrl } from "@/shared/utils";

export const bodyDecorator = (
  html: string,
  recipient_email: string,
  author_id: number,
  subcriber_id: number
) => {
  const token = getUnsubscribeToken({
    email: recipient_email,
    author_id: author_id,
    subscriber_id: subcriber_id,
  });
  const unsubscribeUrl = `${getRootUrl()}/api/unsubscribe?token=${token}`;

  const baseTemplate = path.resolve(
    process.cwd(),
    "src/graphql/mail/templates/base.twig"
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
    unsubscribe_link: subcriber_id
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
