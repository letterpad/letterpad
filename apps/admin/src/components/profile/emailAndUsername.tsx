import React, { useState } from "react";

import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";

import { Buttonv2 } from "@/components_v2/button";
import { Input } from "@/components_v2/input";

import { MeFragmentFragment } from "@/__generated__/queries/queries.graphql";

import { ChangeUsername } from "./change-username";

interface Props {
  data: MeFragmentFragment;
}

export const EmailAndUsername: React.VFC<Props> = ({ data }) => {
  const [email, setEmail] = React.useState(data.email);
  const [emailError, setEmailError] = useState("");
  const { updateAuthor } = useUpdateAuthor(data.id);

  const onEmailChange = (email: string) => {
    setEmail(email);
    if (
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      setEmailError("");
    } else {
      setEmailError("Invalid email address");
    }
  };
  return (
    <>
      <div className="mb-8 grid w-full grid-cols-1 gap-8">
        <div className="grid grid-cols-12 items-end gap-2">
          <div className="col-span-10 lg:col-span-6">
            <Input
              label="Email (private)"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              data-id="email-input"
            />
          </div>
          <Buttonv2
            variant="primary"
            onClick={(_) => updateAuthor({ email })}
            disabled={email === data.email}
            className="col-span-2 lg:col-span-1"
            data-id="email-save-button"
          >
            Save
          </Buttonv2>
        </div>
        {emailError && (
          <span className="-mt-4 text-sm text-red-500">{emailError}</span>
        )}
        <ChangeUsername username={data.username} author_id={data.id} />
      </div>
    </>
  );
};
