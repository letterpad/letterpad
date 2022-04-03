import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";
import { MeFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { Form, Input } from "antd";

interface Props {
  social: MeFragmentFragment["social"];
  id: number;
}
export const Social: React.VFC<Props> = ({ social, id }) => {
  const { debounceUpdateAuthor } = useUpdateAuthor(id);

  return (
    <>
      <Form.Item label="Twitter">
        <Input
          placeholder="https://twitter.com/username"
          size="middle"
          value={social?.twitter}
          onChange={(e) =>
            debounceUpdateAuthor({
              social: { ...social, twitter: e.target.value },
            })
          }
        />
      </Form.Item>
      <Form.Item label="Facebook">
        <Input
          placeholder="https://facebook.com/username"
          size="middle"
          value={social?.facebook}
          onChange={(e) =>
            debounceUpdateAuthor({
              social: { ...social, facebook: e.target.value },
            })
          }
        />
      </Form.Item>
      <Form.Item label="Instagram">
        <Input
          placeholder="https://instagram.com/username"
          size="middle"
          value={social?.instagram}
          onChange={(e) =>
            debounceUpdateAuthor({
              social: { ...social, instagram: e.target.value },
            })
          }
        />
      </Form.Item>
      <Form.Item label="Github">
        <Input
          placeholder="https://github.com/username"
          size="middle"
          value={social?.github}
          onChange={(e) =>
            debounceUpdateAuthor({
              social: { ...social, github: e.target.value },
            })
          }
        />
      </Form.Item>
      <Form.Item label="LinkedIn">
        <Input
          placeholder="https://linkedin.com/in/username/"
          size="middle"
          value={social?.linkedin}
          onChange={(e) =>
            debounceUpdateAuthor({
              social: { ...social, linkedin: e.target.value },
            })
          }
        />
      </Form.Item>
    </>
  );
};
