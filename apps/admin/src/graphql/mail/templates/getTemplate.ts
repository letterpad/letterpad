import { EmailProps, EmailTemplates } from "@/graphql/types";

import { getdomainMapSuccessContent } from "../content/domain-mapping-success";
import { getEmailChangeSuccessContent } from "../content/email-change-success";
import { getNewFollowerContent } from "../content/new-follower";
import { getPaymentFailedContent } from "../content/payment-failed";
import { getSubscriberVerifiedEmailContent } from "../content/subscription-verified";
import { getVerifyUserEmailChangeContent } from "../content/verify-change-email";
import { getVerifyUserEmailContent } from "../content/verify-new-user";
import { getVerifySubscriberEmailContent } from "../content/verify-subscriber";
import { getWelcomeUserContent } from "../content/welcome-user";

export async function getEmailTemplate(props: EmailProps, prismaInstance) {
  switch (props.template_id) {
    case EmailTemplates.VerifySubscriber:
      return await getVerifySubscriberEmailContent(props, prismaInstance);
    case EmailTemplates.SubscriberVerified:
      return await getSubscriberVerifiedEmailContent(props, prismaInstance);
    case EmailTemplates.VerifyNewUser:
      return await getVerifyUserEmailContent(props);
    case EmailTemplates.VerifyChangedEmail:
      return await getVerifyUserEmailChangeContent(props);
    case EmailTemplates.WelcomeUser:
      return await getWelcomeUserContent(props);
    case EmailTemplates.EmailChangeSuccess:
      return await getEmailChangeSuccessContent(props);
    case EmailTemplates.DomainMapSuccess:
      return await getdomainMapSuccessContent(props);
    case EmailTemplates.NewFollower:
      return await getNewFollowerContent(props, prismaInstance);
    case EmailTemplates.PaymentFailed:
      return await getPaymentFailedContent(props);
  }
}
