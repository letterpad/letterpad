"use client";

import { useSession } from "next-auth/react";
import { Button } from "ui";

import { useUpdatePost } from "@/app/post/[postId]/_feature/api.client";

import { useUpdateAuthor } from "../../app/posts/_feature/api.client";
import { ROLES } from "../../graphql/types";

export const AdminActions = ({
  id,
  banned,
  isFavourite,
  authorId,
}: {
  id: number;
  banned: boolean;
  isFavourite: boolean;
  authorId: number;
}) => {
  const { updatePost, fetching } = useUpdatePost();
  const { updateAuthor, fetching: updatingAuthor } = useUpdateAuthor();
  const { data } = useSession();
  const banPost = async () => {
    updatePost({ id, banned: true });
  };
  const favAuthor = async () => {
    updateAuthor({ id: authorId, favourite: true });
  };
  if (data?.user && data.user.role !== ROLES.ADMIN) return null;
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
