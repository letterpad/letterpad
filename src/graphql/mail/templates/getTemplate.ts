import { EmailProps, EmailTemplates } from "@/graphql/types";

import { getEmailChangeSuccessContent } from "../emailChangeSuccess/content";
import { getForgotPasswordContent } from "../forgotPassword/content";
import { getNewPostContent } from "../newPost/content";
import { getPasswordChangeSuccessContent } from "../passwordChangeSuccess/content";
import { getSubscriberVerifiedEmailContent } from "../subscriberVerified/content";
import { getVerifyUserEmailChangeContent } from "../verifyChangedEmail/content";
import { getVerifyUserEmailContent } from "../verifyNewUser/content";
import { getVerifySubscriberEmailContent } from "../verifySubscriber/content";
import { getWelcomeUserContent } from "../welcomeUser/content";

export async function getEmailTemplate(props: EmailProps, prismaInstance) {
  switch (props.template_id) {
    case EmailTemplates.ForgotPassword:
      return await getForgotPasswordContent(props, prismaInstance);
    case EmailTemplates.NewPost:
      return await getNewPostContent(props, prismaInstance);
    case EmailTemplates.VerifySubscriber:
      return await getVerifySubscriberEmailContent(props, prismaInstance);
    case EmailTemplates.SubscriberVerified:
      return await getSubscriberVerifiedEmailContent(props, prismaInstance);
    case EmailTemplates.VerifyNewUser:
      return await getVerifyUserEmailContent(props, prismaInstance);
    case EmailTemplates.VerifyChangedEmail:
      return await getVerifyUserEmailChangeContent(props, prismaInstance);
    case EmailTemplates.WelcomeUser:
      return await getWelcomeUserContent(props, prismaInstance);
    case EmailTemplates.EmailChangeSuccess:
      return await getEmailChangeSuccessContent(props, prismaInstance);
    case EmailTemplates.PasswordChangeSuccess:
      return await getPasswordChangeSuccessContent(props, prismaInstance);
  }
}
