import { useState } from "react";
import { Button, Input } from "ui";

import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";

interface Props {
  id: number;
}
export const ChangePassword: React.VFC<Props> = ({ id }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateAuthor } = useUpdateAuthor(id);

  const onPasswordChange = (password: string) => {
    setPassword(password);
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
    } else {
      setError("");
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 items-end gap-2">
        <div className="col-span-10 lg:col-span-6">
          <Input
            label="Password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            type="password"
          />
        </div>
        <Button
          variant="primary"
          onClick={(_) => updateAuthor({ password })}
          disabled={error.length > 0}
          className="col-span-2 lg:col-span-1"
        >
          Save
        </Button>
      </div>
      <span className="-mt-4 text-sm text-red-500">{error}</span>
    </>
  );

  return (
    <>
      <Input
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
      />
      <Button variant="primary" onClick={(_) => updateAuthor({ password })}>
        Save
      </Button>
    </>
  );
};
