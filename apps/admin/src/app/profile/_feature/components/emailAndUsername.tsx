import { MeFragmentFragment } from "letterpad-graphql";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "ui";

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
      <div className="mb-8 grid w-full grid-cols-1 gap-8">
        <div className="grid grid-cols-12 items-end gap-2">
          <div className="col-span-10 lg:col-span-6">
            <Input
              label="Email (private)"
              {...register("email", { validate: onEmailChange })}
              data-id="email-input"
            />
          </div>
          <SaveButton
            testId="email-save-button"
            disabled={!getFieldState("email").isDirty}
            className="col-span-2 lg:col-span-1"
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
