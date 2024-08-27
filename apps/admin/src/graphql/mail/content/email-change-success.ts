import {
  EmailChangeSuccessProps,
  EmailTemplateResponse,
} from "@/graphql/types";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";
import {
  getBaseVariables,
  replaceBodyVariables,
  replaceSubjectVariables,
} from "../variables";

export async function getEmailChangeSuccessContent(
  data: EmailChangeSuccessProps
): Promise<EmailTemplateResponse> {
  const template = await getTemplate(data.template_id);

  const variables = await getBaseVariables(data.author_id);
  if (!variables) {
    return {
      ok: false,
      message: `No base variables found for the current blog.`,
    };
  }
  const subject = replaceSubjectVariables(template.subject, variables.subject);
  const body = replaceBodyVariables(template.body, variables.body);

  return {
    ok: true,
    content: {
      subject,
      html: addLineBreaks(body),
      to: variables.meta.author.email,
    },
    meta: variables.meta,
  };
}
