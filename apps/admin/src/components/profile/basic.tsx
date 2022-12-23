import React, { useMemo } from "react";

import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";

import { Input, Label } from "@/components_v2/input";
import { TextArea } from "@/components_v2/textarea";
import { Upload } from "@/components_v2/upload";

import { InputAuthor } from "@/__generated__/__types__";
import { MeFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { debounce } from "@/shared/utils";

interface Props {
  data: MeFragmentFragment;
}

export const Basic: React.VFC<Props> = ({ data }) => {
  const { updateAuthorAPI, updateLocalState } = useUpdateAuthor(data.id);

  const debounceUpdateAuthorAPI = useMemo(
    () => debounce((data) => updateAuthorAPI(data), 500),
    [updateAuthorAPI]
  );

  const update = (data: Omit<InputAuthor, "id">) => {
    updateLocalState(data);
    debounceUpdateAuthorAPI(data);
  };

  return (
    <>
      <div className="mb-8 grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
        <Input
          label="Full Name"
          placeholder="Write you full name"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          data-testid="name"
        />
        <Input
          label="Occupation"
          placeholder="What do you do ?"
          value={data.occupation}
          onChange={(e) => update({ occupation: e.target.value })}
          data-testid="occupation"
        />
        <TextArea
          label="About You (html)"
          placeholder="Write about you. This will be displayed in the about me page. (4000 characters)"
          value={data.bio}
          onChange={(e) => update({ bio: e.target.value })}
          autoGrow={true}
          rows={5}
          maxLength={4000}
          data-testid="about"
        />
        <div>
          <Label label="Avatar" />
          <Upload
            className="h-28 w-28"
            url={data.avatar || ""}
            onSuccess={([res]) => {
              update({ avatar: res.src });
            }}
          />
        </div>
        <Input
          label="Company Name"
          placeholder="Which company do you work for ?"
          value={data.company_name}
          data-testid="company"
          onChange={(e) => update({ company_name: e.target.value })}
        />
      </div>
    </>
  );
};
