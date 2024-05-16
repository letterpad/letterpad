import { MeFragmentFragment } from "letterpad-graphql";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "ui/dist/index.mjs";

import { SaveButton } from "@/components/save-button";

import { ChangeUsername } from "./change-username";

interface Props {
  data: MeFragmentFragment;
}

export const EmailAndUsername: React.VFC<Props> = ({ data }) => {
  const [emailError, setEmailError] = useState("");
  const { register, getFieldState } = useFormContext();
  const onEmailChange = (email: string) => {
    if (
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      setEmailError("");
      return true;
    }
    setEmailError("Invalid email address");
    return false;
  };
  return (
    <>
      <div className="mb-8 w-full gap-8 space-y-8">
        <div className="flex items-end gap-2">
          <Input
            label="Email (private)"
            {...register("email", { validate: onEmailChange })}
            data-id="email-input"
          />
          <SaveButton
            testId="email-save-button"
            disabled={!getFieldState("email").isDirty}
          />
        </div>
        {emailError && (
          <span className="-mt-4 text-sm text-red-500">{emailError}</span>
        )}
        <ChangeUsername username={data.username} author_id={data.id} />
      </div>
    </>
  );
};
