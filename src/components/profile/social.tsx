import { Form, Input } from "antd";

import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";

import { InputSocial } from "@/__generated__/__types__";
import { MeFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { removeTypenames } from "@/shared/utils";

interface Props {
  social: MeFragmentFragment["social"];
  id: number;
}

const getUsernamefromUrl = (str: string | undefined) =>
  str ? str.split("/").pop() : "";

export const Social: React.VFC<Props> = ({ social, id }) => {
  const { debounceUpdateAuthor } = useUpdateAuthor(id);

  const updateSocial = (inp: InputSocial) => {
    debounceUpdateAuthor({
      social: { ...removeTypenames(social), ...inp },
    });
  };
  const verify = (str: string) => {
    const res = /^[a-z0-9_\\.]+$/.exec(str);
    const valid = !!res;
    return valid;
  };

  return (
    <>
      <Form.Item label="Twitter">
        <Input
          placeholder="username"
          size="middle"
          value={getUsernamefromUrl(social?.twitter)}
          onChange={(e) =>
            verify(e.target.value) && updateSocial({ twitter: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item label="Facebook">
        <Input
          placeholder="username"
          size="middle"
          value={getUsernamefromUrl(social?.facebook)}
          onChange={(e) =>
            verify(e.target.value) && updateSocial({ facebook: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item label="Instagram">
        <Input
          placeholder="username"
          size="middle"
          value={getUsernamefromUrl(social?.instagram)}
          onChange={(e) =>
            verify(e.target.value) &&
            updateSocial({ instagram: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item label="Github">
        <Input
          placeholder="username"
          size="middle"
          value={getUsernamefromUrl(social?.github)}
          onChange={(e) =>
            verify(e.target.value) && updateSocial({ github: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item label="LinkedIn">
        <Input
          placeholder="username/"
          size="middle"
          value={getUsernamefromUrl(social?.linkedin)}
          onChange={(e) =>
            verify(e.target.value) && updateSocial({ linkedin: e.target.value })
          }
        />
      </Form.Item>
    </>
  );
};
