import { getRootUrl } from "@/shared/getRootUrl";
import { getUnsubscribeToken } from "@/shared/token";

import { baseTemplate } from "./templates/base";

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
  const unsubscribe_link = subcriber_id
    ? `Changed your mind about receiving our emails? You can
                      <a target="_blank" href="${unsubscribeUrl}"
                        >Unsubscribe</a
                      > at any time.
                 `
    : "";

  const body = baseTemplate
    .replace("content", html)
    .replace("unsubscribe_link", unsubscribe_link);
  return body;
};
