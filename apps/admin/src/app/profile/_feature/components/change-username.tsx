import { FC, useState } from "react";
import { Button, Input } from "ui";

import { sanitizeUsername } from "@/shared/utils";

import { useUpdateAuthor } from "../../../posts/_feature/api.client";

interface Props {
  username: string;
  author_id: number;
}

export const ChangeUsername: FC<Props> = ({ username, author_id }) => {
  const [_username, setUsername] = useState(username);
  const [error, setError] = useState<string | null>(null);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(true);

  const { updateAuthor, fetching } = useUpdateAuthor();

  const tryUpdateAuthor = async () => {
    setError(null);
    const result = await updateAuthor({ username: _username, id: author_id });
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
          onClick={tryUpdateAuthor}
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
