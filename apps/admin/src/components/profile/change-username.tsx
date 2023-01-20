import { FC, useState } from "react";
import { Button, Input } from "ui";

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
    <>
      <div className="grid grid-cols-12 items-end gap-2">
        <div className="col-span-10 lg:col-span-6">
          <Input
            label="Username"
            value={_username}
            onChange={onUsernameChange}
          />
        </div>
        <Button
          variant="primary"
          onClick={updateAuthor}
          disabled={!saveButtonEnabled}
          className="col-span-2 lg:col-span-1"
        >
          Save
        </Button>
      </div>
      <span className="-mt-4 text-sm text-red-500">{error}</span>
    </>
  );
};
