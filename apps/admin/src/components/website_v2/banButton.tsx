"use client";

import { useSession } from "next-auth/react";
import { Button } from "ui";

import { useUpdatePost } from "@/app/post/[postId]/_feature/api.client";

import { ROLES } from "../../graphql/types";

export const BanButton = ({ id }: { id: number }) => {
  const { updatePost, fetching } = useUpdatePost();
  const { data } = useSession();
  const banPost = async () => {
    updatePost({ id, banned: true });
  };
  if (data?.user && data.user.role !== ROLES.ADMIN) return null;
  return (
    <Button
      onClick={banPost}
      disabled={fetching}
      size="small"
      variant="secondary"
      className="mt-7 px-2 text-xs"
    >
      Ban
    </Button>
  );
};
