import React from "react";
import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";
import { MeFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { Button, Form, Input } from "antd";
import ImageUpload from "../ImageUpload";

interface Props {
  data: MeFragmentFragment;
}

export const Basic: React.VFC<Props> = ({ data }) => {
  const [email, setEmail] = React.useState(data.email);
  const [username, setUsername] = React.useState(data.username);
  const { debounceUpdateAuthor, updateAuthor } = useUpdateAuthor(data.id);

  return (
    <>
      <Form.Item label="Full Name">
        <Input
          placeholder="Write you full name"
          size="middle"
          value={data.name}
          onChange={(e) => debounceUpdateAuthor({ name: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="About You (html)">
        <Input.TextArea
          placeholder="Write about you. This will be displayed in the about me page. (4000 characters)"
          value={data.bio}
          onChange={(e) => debounceUpdateAuthor({ bio: e.target.value })}
          autoSize={{ minRows: 10, maxRows: 80 }}
          rows={8}
          maxLength={4000}
        />
      </Form.Item>
      <Form.Item label="Occupation">
        <Input
          placeholder="What do you do ?"
          value={data.occupation}
          onChange={(e) => debounceUpdateAuthor({ occupation: e.target.value })}
          size="middle"
        />
      </Form.Item>
      <Form.Item label="Company Name">
        <Input
          placeholder="Which company do you work for ?"
          size="middle"
          value={data.company_name}
          onChange={(e) =>
            debounceUpdateAuthor({ company_name: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item label="Email (private)">
        <Input.Group compact>
          <Input
            size="middle"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "calc(100% - 100px)" }}
          />
          <Button
            type="primary"
            size="middle"
            onClick={(_) => updateAuthor({ email })}
            disabled={email === data.email}
          >
            Save
          </Button>
        </Input.Group>
      </Form.Item>
      <Form.Item label="Username">
        <Input.Group compact>
          <Input
            size="middle"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "calc(100% - 100px)" }}
          />
          <Button
            type="primary"
            size="middle"
            onClick={(_) => updateAuthor({ username })}
            disabled={username === data.username}
          >
            Save
          </Button>
        </Input.Group>
      </Form.Item>
      <Form.Item label="Avatar">
        <ImageUpload
          url={data.avatar || ""}
          name="Avatar"
          onDone={([res]) => {
            updateAuthor({ avatar: res.src });
          }}
        />
      </Form.Item>
    </>
  );
};
