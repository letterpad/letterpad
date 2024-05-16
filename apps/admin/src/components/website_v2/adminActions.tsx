"use client";

import { useSession } from "next-auth/react";
import { FC } from "react";
import { Button } from "ui/dist/index.mjs";

import { useUpdatePost } from "@/app/(protected)/post/[postId]/_feature/api.client";

import { PostProvider } from "../../app/(protected)/post/[postId]/_feature/context";
import { useUpdateAuthor } from "../../app/(protected)/posts/_feature/api.client";
import { ROLES } from "../../graphql/types";
interface Props {
  id: string;
  banned: boolean;
  isFavourite: boolean;
  authorId: string;
}

export const AdminActions: FC<Props> = (props) => {
  return (
    <PostProvider addSettings={false}>
      <Buttons {...props} />
    </PostProvider>
  );
};

const Buttons: FC<Props> = ({ id, banned, isFavourite, authorId }) => {
  const { updatePost, fetching } = useUpdatePost();
  const { updateAuthor, fetching: updatingAuthor } = useUpdateAuthor();
  const { data } = useSession();
  const banPost = async () => {
    updatePost({ id, banned: true });
  };
  const favAuthor = async () => {
    updateAuthor({ id: authorId, favourite: true });
  };
  if (!data?.user?.role) return null;
  if (data.user.role !== ROLES.ADMIN) return null;
  return (
    <div className="flex gap-2">
      <Button
        onClick={banPost}
        disabled={fetching}
        size="small"
        variant="secondary"
        className="mt-7 px-2 text-xs"
      >
        {banned ? "Unban" : "Ban"}
      </Button>
      <Button
        onClick={favAuthor}
        disabled={updatingAuthor}
        size="small"
        variant="secondary"
        className="mt-7 px-2 text-xs"
      >
        {isFavourite ? "Unfavourite" : "Favourite"}
      </Button>
    </div>
  );
};
