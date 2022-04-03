import { useState } from "react";
import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";
import { Button, Form, Input } from "antd";

interface Props {
  id: number;
}
export const ChangePassword: React.VFC<Props> = ({ id }) => {
  const [password, setPassword] = useState("");
  const { updateAuthor } = useUpdateAuthor(id);

  return (
    <>
      <Form.Item label="Password">
        <Input
          size="middle"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
        />
        <Button
          type="primary"
          size="middle"
          onClick={(_) => updateAuthor({ password })}
        >
          Save
        </Button>
      </Form.Item>
    </>
  );
};
