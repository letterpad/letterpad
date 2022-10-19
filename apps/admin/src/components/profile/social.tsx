import { Form, Input } from "antd";
import { useMemo } from "react";

import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";

import { MeFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { debounce, removeTypenames } from "@/shared/utils";

interface Props {
  social: MeFragmentFragment["social"];
  id: number;
}
type ChangeEvent = React.ChangeEvent<HTMLInputElement> & KeyboardEvent;

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
        500,
      ),
    [social, updateAuthorAPI],
  );

  const verify = (e: ChangeEvent) => {
    if (e.target.value === "") return true;
    const res = /^[a-z0-9_\\.]+$/.exec(e.target.value);
    const valid = !!res;
    return valid;
  };

  return (
    <>
      <Form.Item label="Twitter">
        <Input
          addonBefore="@"
          placeholder="username"
          size="middle"
          value={getUsernamefromUrl(social?.twitter)}
          onChange={(e: ChangeEvent) => {
            if (!verify(e)) return;
            updateSocial({ twitter: e.target.value });
            const data = {
              social: { ...removeTypenames(social), twitter: e.target.value },
            };
            updateLocalState(data);
          }}
        />
      </Form.Item>
      <Form.Item label="Facebook">
        <Input
          addonBefore="@"
          placeholder="username"
          size="middle"
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
      </Form.Item>
      <Form.Item label="Instagram">
        <Input
          addonBefore="@"
          placeholder="username"
          size="middle"
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
      </Form.Item>
      <Form.Item label="Github">
        <Input
          addonBefore="@"
          placeholder="username"
          size="middle"
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
      </Form.Item>
      <Form.Item label="LinkedIn">
        <Input
          addonBefore="@"
          placeholder="username/"
          size="middle"
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
      </Form.Item>
    </>
  );
};
