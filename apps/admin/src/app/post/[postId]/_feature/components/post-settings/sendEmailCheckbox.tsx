import { MailStatus, PostStatusOptions } from "letterpad-graphql";
import { ChangeEvent, FC, useState } from "react";

import { useIsPaidMember } from "@/hooks/useIsPaidMember";

import { isMembershipFeatureActive } from "@/utils/config";

interface Props {
  mail_status: MailStatus;
  post_status: PostStatusOptions;
  onChange: (mail_status: MailStatus) => void;
}
export const SendEmailCheckbox: FC<Props> = ({ mail_status, onChange }) => {
  const [mailStatus, setMailStatus] = useState(mail_status);
  const isPaidMember = useIsPaidMember();
  const membershipActive = isMembershipFeatureActive();

  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        value={MailStatus.Active}
        checked={[MailStatus.Active, MailStatus.Sent].includes(mailStatus!)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setMailStatus(
            e.target.checked ? MailStatus.Active : MailStatus.Inactive
          );
          onChange(
            mailStatus === MailStatus.Active
              ? MailStatus.Inactive
              : MailStatus.Active
          );
        }}
        id="mail-status"
        disabled={
          !isPaidMember && membershipActive
            ? true
            : mail_status === MailStatus.Sent
        }
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor="mail-status"
        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {mail_status === MailStatus.Sent
          ? "Email sent to subscribers"
          : "Email subscribers when this post is published"}
      </label>
    </div>
  );
};
