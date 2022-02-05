import { EmailProps, EmailTemplates } from "@/graphql/types";
import { getNewPostContent } from "../new-post/content";
import { getForgotPasswordContent } from "../forgot-password/content";
import { getVerifyUserEmailContent } from "../verify-user/content";
import { getVerifySubscriberEmailContent } from "../verify-subscriber/content";

export async function getEmailTemplate(props: EmailProps, prismaInstance) {
  switch (props.template_id) {
    case EmailTemplates.FORGOT_PASSWORD:
      return await getForgotPasswordContent(props, prismaInstance);
    case EmailTemplates.NEW_POST:
      return await getNewPostContent(props, prismaInstance);
    case EmailTemplates.VERIFY_NEW_SUBSCRIBER:
      return await getVerifySubscriberEmailContent(props, prismaInstance);
    case EmailTemplates.VERIFY_NEW_USER:
      return await getVerifyUserEmailContent(props, prismaInstance);
  }
}
