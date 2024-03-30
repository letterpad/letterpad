import { MailStatus, PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { ChangeEvent, FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useIsPaidMember } from "@/hooks/useIsPaidMember";

import { UpgradeLabel } from "@/components/upgrade-plan-banner";

import { isMembershipFeatureActive } from "@/utils/config";

import { Heading } from "./heading";

export const SendEmailCheckbox: FC = () => {
  const isPaidMember = useIsPaidMember();
  const membershipActive = isMembershipFeatureActive();
  const { watch, control } = useFormContext<PostWithAuthorAndTagsFragment>();
  return (
    <div>
      <Heading
        heading="Email Subscribers and Followers"
        subheading={
          <>
            Notify your email subscribers and followers when you publish this
            post.{" "}
            {membershipActive && !isPaidMember ? (
              <>
                <UpgradeLabel /> to enable this feature.
              </>
            ) : null}
          </>
        }
      />
      <div className="flex items-center mb-4">
        <Controller
          name="mail_status"
          control={control}
          render={({ field: { onChange } }) => (
            <input
              type="checkbox"
              value={watch("mail_status")!}
              checked={[MailStatus.Active, MailStatus.Sent].includes(
                watch("mail_status")!
              )}
              id="mail-status"
              disabled={
                !isPaidMember && membershipActive
                  ? true
                  : watch("mail_status") === MailStatus.Sent
              }
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onChange(
                  e.target.checked ? MailStatus.Active : MailStatus.Inactive
                );
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          )}
        />
        <label
          htmlFor="mail-status"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {watch("mail_status") === MailStatus.Sent
            ? "Email sent to subscribers"
            : "Email subscribers when this post is published"}
        </label>
      </div>
    </div>
  );
};
