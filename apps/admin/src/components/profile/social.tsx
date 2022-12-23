import { useMemo } from "react";

import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";

import { Input } from "@/components_v2/input";

import { MeFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { debounce, removeTypenames } from "@/shared/utils";

interface Props {
  social: MeFragmentFragment["social"];
  id: number;
}
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

const getUsernamefromUrl = (str: string | undefined) =>
  str ? str.split("/").pop() : "";

export const Social: React.VFC<Props> = ({ social, id }) => {
  const { updateAuthorAPI, updateLocalState } = useUpdateAuthor(id);

  const updateSocial = useMemo(
    () =>
      debounce(
        (inp) =>
          updateAuthorAPI({
            social: { ...removeTypenames(social), ...inp },
          }),
        500
      ),
    [social, updateAuthorAPI]
  );

  const verify = (e: ChangeEvent) => {
    if (e.target.value === "") return true;
    const res = /^[a-z0-9_\\.]+$/.exec(e.target.value);
    const valid = !!res;
    return valid;
  };

  return (
    <>
      <div className="mb-8 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <Input
          label="Twitter"
          addonBefore="@"
          placeholder="username"
          value={getUsernamefromUrl(social?.twitter)}
          onChange={(e) => {
            if (!verify(e)) return;
            updateSocial({ twitter: e.target.value });
            const data = {
              social: { ...removeTypenames(social), twitter: e.target.value },
            };
            updateLocalState(data);
          }}
        />

        <Input
          label="Facebook"
          addonBefore="@"
          placeholder="username"
          value={getUsernamefromUrl(social?.facebook)}
          onChange={(e: ChangeEvent) => {
            if (!verify(e)) return;
            updateSocial({ facebook: e.target.value });
            const data = {
              social: { ...removeTypenames(social), facebook: e.target.value },
            };
            updateLocalState(data);
          }}
        />

        <Input
          label="Instagram"
          addonBefore="@"
          placeholder="username"
          value={getUsernamefromUrl(social?.instagram)}
          onChange={(e: ChangeEvent) => {
            if (!verify(e)) return;
            updateSocial({ instagram: e.target.value });
            const data = {
              social: { ...removeTypenames(social), instagram: e.target.value },
            };
            updateLocalState(data);
          }}
        />

        <Input
          label="Github"
          addonBefore="@"
          placeholder="username"
          value={getUsernamefromUrl(social?.github)}
          onChange={(e: ChangeEvent) => {
            if (!verify(e)) return;
            updateSocial({ github: e.target.value });
            const data = {
              social: { ...removeTypenames(social), github: e.target.value },
            };
            updateLocalState(data);
          }}
        />

        <Input
          label="LinkedIn"
          addonBefore="@"
          placeholder="username/"
          value={getUsernamefromUrl(social?.linkedin)}
          onChange={(e: ChangeEvent) => {
            if (!verify(e)) return;
            updateSocial({ linkedin: e.target.value });
            const data = {
              social: { ...removeTypenames(social), linkedin: e.target.value },
            };
            updateLocalState(data);
          }}
        />
      </div>
    </>
  );
};
