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
  const { updateAuthorAPI } = useUpdateAuthor(data.id);

  const onEmailChange = (email: string) => {
    setEmail(email);
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
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
            />
          </div>
          <Buttonv2
            variant="primary"
            onClick={(_) => updateAuthorAPI({ email })}
            disabled={email === data.email}
            className="col-span-2 lg:col-span-1"
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
