import { EmailProps, EmailTemplates } from "@/graphql/types";

import { getVerifyUserEmailContent } from "./emailVerifyUser";
import { getForgotPasswordContent } from "./emailForgotPassword";
import { getNewPostContent } from "./emailNewPost";
import { getVerifySubscriberEmailContent } from "./emailVerifySubscriber";

export async function getEmailTemplate(props: EmailProps) {
  switch (props.template_id) {
    case EmailTemplates.FORGOT_PASSWORD:
      return await getForgotPasswordContent(props);
    case EmailTemplates.NEW_POST:
      return await getNewPostContent(props);
    case EmailTemplates.VERIFY_NEW_SUBSCRIBER:
      return await getVerifySubscriberEmailContent(props);
    case EmailTemplates.VERIFY_NEW_USER:
      return await getVerifyUserEmailContent(props);
  }
}
