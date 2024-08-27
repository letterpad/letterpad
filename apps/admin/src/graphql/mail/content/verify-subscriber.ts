import { PrismaClient } from "@prisma/client";

import {
  EmailTemplateResponse,
  EmailVerifySubscriberProps,
} from "@/graphql/types";
import { getRootUrl } from "@/shared/getRootUrl";
import { getVerifySubscriberToken } from "@/shared/token";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";
import { getBaseVariables, replaceBodyVariables, replaceSubjectVariables } from "../variables";

export async function getVerifySubscriberEmailContent(
  data: EmailVerifySubscriberProps,
  prisma: PrismaClient
): Promise<EmailTemplateResponse> {
  const template = await getTemplate(data.template_id);


  const variables = await getBaseVariables(data.author_id);
  if (!variables) {
    return {
      ok: false,
      message: `No base variables found for the current blog.`,
    };
  }
  const subscriber = await prisma.subscriber.findFirst({
    where: { id: data.subscriber_id },
  });

  if (!subscriber) {
    return {
      ok: false,
      message: `No info found for subscriber. Check if the record exist`,
    };
  }

  const token = await getVerifySubscriberToken({
    email: subscriber.email,
    subscriber_id: subscriber.id,
    author_id: data.author_id,
  });

  const verify_link = `${getRootUrl()}/api/verifySubscriber?token=${token}&subscriber=1`;
  const subject = replaceSubjectVariables(template.subject, variables.subject);
  const body = replaceBodyVariables(template.body, { ...variables.body, verify_link, verify_link_text: "Verify Email" });

  return {
    ok: true,
    content: { subject, html: addLineBreaks(body), to: variables.meta.author.email },
    meta: variables.meta,
  };
}
