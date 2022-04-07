import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";
import { removeTypenames } from "@/shared/utils";
import { MeFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { InputSocial } from "@/__generated__/__types__";
import { Form, Input } from "antd";

interface Props {
  social: MeFragmentFragment["social"];
  id: number;
}
export const Social: React.VFC<Props> = ({ social, id }) => {
  const { debounceUpdateAuthor } = useUpdateAuthor(id);

  const updateSocial = (inp: InputSocial) => {
    debounceUpdateAuthor({
      social: { ...removeTypenames(social), ...inp },
    });
  };
  return (
    <>
      <Form.Item label="Twitter">
        <Input
          placeholder="https://twitter.com/username"
          size="middle"
          value={social?.twitter}
          onChange={(e) => {
            updateSocial({ twitter: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Facebook">
        <Input
          placeholder="https://facebook.com/username"
          size="middle"
          value={social?.facebook}
          onChange={(e) => updateSocial({ facebook: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Instagram">
        <Input
          placeholder="https://instagram.com/username"
          size="middle"
          value={social?.instagram}
          onChange={(e) => updateSocial({ instagram: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Github">
        <Input
          placeholder="https://github.com/username"
          size="middle"
          value={social?.github}
          onChange={(e) => updateSocial({ github: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="LinkedIn">
        <Input
          placeholder="https://linkedin.com/in/username/"
          size="middle"
          value={social?.linkedin}
          onChange={(e) => updateSocial({ linkedin: e.target.value })}
        />
      </Form.Item>
    </>
  );
};
