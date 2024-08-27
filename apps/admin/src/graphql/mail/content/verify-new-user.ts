import {
  EmailTemplateResponse,
  EmailVerifyNewUserProps,
} from "@/graphql/types";
import { getRootUrl } from "@/shared/getRootUrl";
import { getVerifyUserToken } from "@/shared/token";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";
import { getBaseVariables, replaceBodyVariables, replaceSubjectVariables } from "../variables";

export async function getVerifyUserEmailContent(
  data: EmailVerifyNewUserProps,
): Promise<EmailTemplateResponse> {
  const template = await getTemplate(data.template_id);


  const variables = await getBaseVariables(data.author_id);
  if (!variables) {
    return {
      ok: false,
      message: `No base variables found for the current blog.`,
    };
  }
  const token = await getVerifyUserToken({
    author_id: variables.meta.author.id,
    email: variables.meta.author.email,
  });
  const verify_link = `${getRootUrl()}/api/verify?token=${token}`;
  const subject = replaceSubjectVariables(template.subject, variables.subject);
  const body = replaceBodyVariables(template.body, { ...variables.body, verify_link, verify_link_text: "Verify Email" });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: variables.meta.author.email },
    meta: variables.meta,
  };

}
