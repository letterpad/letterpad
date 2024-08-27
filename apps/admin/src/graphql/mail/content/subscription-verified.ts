import { PrismaClient } from "@prisma/client";

import {
  EmailSubscriberVerifiedProps,
  EmailTemplateResponse,
} from "@/graphql/types";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";
import {
  getBaseVariables,
  replaceBodyVariables,
  replaceSubjectVariables,
} from "../variables";

export async function getSubscriberVerifiedEmailContent(
  data: EmailSubscriberVerifiedProps,
  prisma: PrismaClient
): Promise<EmailTemplateResponse> {
  const template = await getTemplate(data.template_id);

  const subscriber = await prisma.subscriber.findFirst({
    where: { id: data.subscriber_id },
  });

  if (!subscriber) {
    return {
      ok: false,
      message: `No info found for subscriber. Check if the record exist`,
    };
  }

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
    content: { subject, html: addLineBreaks(body), to: subscriber.email },
    meta: variables.meta,
  };
}
