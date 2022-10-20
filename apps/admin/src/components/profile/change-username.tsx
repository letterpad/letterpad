import { Button, Form, Input } from "antd";
import { FC, useState } from "react";

import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";

import { sanitizeUsername } from "@/shared/utils";

interface Props {
  username: string;
  author_id: number;
}

export const ChangeUsername: FC<Props> = ({ username, author_id }) => {
  const [_username, setUsername] = useState(username);
  const [error, setError] = useState<string | null>(null);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(true);

  const { updateAuthorAPI, loading } = useUpdateAuthor(author_id);

  const updateAuthor = async () => {
    setError(null);
    const result = await updateAuthorAPI({ username: _username });
    if (result.data?.updateAuthor?.__typename === "Failed") {
      setError(result.data.updateAuthor.message);
      setSaveButtonEnabled(false);
    }
  };

  const onUsernameChange = (e: any) => {
    const allowed = sanitizeUsername(e.target.value);
    setUsername(e.target.value);
    setSaveButtonEnabled(true);

    if (!allowed) {
      setError("Only letters, numbers, underscore, hyphen and dot are allowed");
      setSaveButtonEnabled(false);
    } else if (e.target.value.length < 4) {
      setError("Username should be atleast 4 characters long");
      setSaveButtonEnabled(false);
    } else {
      setError(null);
    }
  };

  return (
    <Form.Item label="Username">
      <Input.Group compact>
        <Input
          size="middle"
          value={_username}
          onChange={onUsernameChange}
          style={{ width: "calc(100% - 100px)" }}
        />
        <Button
          type="primary"
          size="middle"
          onClick={updateAuthor}
          disabled={!saveButtonEnabled}
          loading={loading}
        >
          Save
        </Button>
      </Input.Group>
      <small style={{ color: "red" }}>{error}</small>
    </Form.Item>
  );
};
