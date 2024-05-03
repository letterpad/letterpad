import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { Button, Input } from "ui";

import { useUpdateAuthor } from "@/app/posts/_feature/api.client";
import { sanitizeUsername } from "@/shared/utils";
import { EventAction, EventCategory, EventLabel, track } from "@/track";

interface Props {
  username: string;
  author_id: string;
}

export const ChangeUsername: FC<Props> = ({ username, author_id }) => {
  const [_username, setUsername] = useState(username);
  const { update, data } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(true);

  const { updateAuthor } = useUpdateAuthor();

  const tryUpdateAuthor = async () => {
    setError(null);
    const result = await updateAuthor({ username: _username, id: author_id });
    if (result.data?.updateAuthor?.__typename === "Failed") {
      setError(result.data.updateAuthor.message);
      setSaveButtonEnabled(false);
    } else if (data) {
      track({
        eventAction: EventAction.Click,
        eventCategory: EventCategory.Profile,
        eventLabel: EventLabel.UsernameChange,
      });
      update({ ...data, user: { ...data.user, username: _username } });
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
      <div className="gap-2">
        <div className="flex items-end gap-2">
          <Input
            label="Username"
            value={_username}
            onChange={onUsernameChange}
          />
          <Button onClick={tryUpdateAuthor} disabled={!saveButtonEnabled}>
            Save
          </Button>
        </div>
      </div>
      <span className="-mt-4 text-sm text-red-500">{error}</span>
    </>
  );
};
