import { mail } from "@/lib/mail";

import { bodyDecorator } from "@/graphql/mail/decorator";
import { getRootUrl } from "@/shared/getRootUrl";

interface Props {
  name: string;
  to: string;
  subject: string;
  username: string;
  html: string;
  author_id: number;
}
export const triggerMail = async ({
  html,
  name,
  username,
  to,
  subject,
  author_id,
}: Props) => {
  const hostname = new URL(getRootUrl()).hostname;
  let _html = html.replace(/@name/g, name);
  _html = _html.replace(/@username/g, username);
  _html = _html.replace(/@email/g, to);
  _html = _html.replace(/@profile_link/g, `https://${username}.${hostname}">`);
  const response = await send({
    subject,
    html: _html,
    author_id,
    author_name: name,
    to,
  });
  return response;
};

interface Props2 {
  html: string;
  subject: string;
  to: string;
  author_id: number;
  author_name: string;
}
async function send({ html, subject, to, author_id, author_name }: Props2) {
  try {
    const body = await bodyDecorator(html, to, author_id, 0);
    // send mail
    const fromEmail = process.env.SENDER_EMAIL;
    const addBcc = false;
    const response = await mail(
      {
        from: `"Letterpad" <${fromEmail}>`,
        replyTo: `"${author_name}" <${to}>`,
        to: `"${author_name}" <${to}>`,
        subject: subject,
        html: body,
      },
      addBcc
    );

    return response;
  } catch (e: any) {
    // console.log(e);
  }
}
