import { Button, Form, Input } from "antd";
import React, { useMemo } from "react";

import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";

import { InputAuthor } from "@/__generated__/__types__";
import { MeFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { debounce } from "@/shared/utils";

import ImageUpload from "../ImageUpload";

interface Props {
  data: MeFragmentFragment;
}

export const Basic: React.VFC<Props> = ({ data }) => {
  const [email, setEmail] = React.useState(data.email);
  const [username, setUsername] = React.useState(data.username);
  const { updateAuthorAPI, updateLocalState } = useUpdateAuthor(data.id);

  const debounceUpdateAuthorAPI = useMemo(
    () => debounce((data) => updateAuthorAPI(data), 500),
    [updateAuthorAPI],
  );

  const update = (data: Omit<InputAuthor, "id">) => {
    updateLocalState(data);
    debounceUpdateAuthorAPI(data);
  };

  return (
    <>
      <Form.Item label="Full Name">
        <Input
          placeholder="Write you full name"
          size="middle"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          data-testid="name"
        />
      </Form.Item>
      <Form.Item label="About You (html)">
        <Input.TextArea
          placeholder="Write about you. This will be displayed in the about me page. (4000 characters)"
          value={data.bio}
          onChange={(e) => update({ bio: e.target.value })}
          autoSize={{ minRows: 10, maxRows: 80 }}
          rows={8}
          maxLength={4000}
          data-testid="about"
        />
      </Form.Item>
      <Form.Item label="Occupation">
        <Input
          placeholder="What do you do ?"
          value={data.occupation}
          onChange={(e) => update({ occupation: e.target.value })}
          size="middle"
          data-testid="occupation"
        />
      </Form.Item>
      <Form.Item label="Company Name">
        <Input
          placeholder="Which company do you work for ?"
          size="middle"
          value={data.company_name}
          data-testid="company"
          onChange={(e) => update({ company_name: e.target.value })}
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
            onClick={(_) => updateAuthorAPI({ email })}
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
            onClick={(_) => updateAuthorAPI({ username })}
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
            update({ avatar: res.src });
          }}
          dataTestid="avatar"
          // onRemove={() => {
          //   updateLocalState({ avatar: "" });
          // }}
        />
      </Form.Item>
    </>
  );
};
