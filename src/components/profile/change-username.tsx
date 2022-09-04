import { Button, Form, Input } from "antd";
import { getSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";

import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";

interface Props {
  username: string;
  author_id: number;
}

export const ChangeUsername: FC<Props> = ({ username, author_id }) => {
  const [_username, setUsername] = useState(username);
  const [error, setError] = useState<string | null>(null);

  const { updateAuthorAPI, loading } = useUpdateAuthor(author_id);

  const updateAuthor = async () => {
    setError(null);
    const result = await updateAuthorAPI({ username: _username });
    if (result.data?.updateAuthor?.__typename === "Failed") {
      setError(result.data.updateAuthor.message);
    }
  };

  return (
    <Form.Item label="Username">
      <Input.Group compact>
        <Input
          size="middle"
          value={_username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "calc(100% - 100px)" }}
        />
        <Button
          type="primary"
          size="middle"
          onClick={updateAuthor}
          disabled={username === _username}
          loading={loading}
        >
          Save
        </Button>
      </Input.Group>
      <small style={{ color: "red" }}>{error}</small>
    </Form.Item>
  );
};
