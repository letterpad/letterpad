import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { FC } from "react";
import { BuilderContext, Layout as LayoutBuilder } from "ui/dist/index.mjs";

import "./creatives.css";

import { FileExplorer } from "@/components/file-explorer";

import { useUpdatePost } from "../api.client";
import { Title } from "../components/title";
interface Props {
  post?: PostWithAuthorAndTagsFragment;
}

export const Creatives: FC<Props> = ({ post }) => {
  const { updatePostWithDebounce } = useUpdatePost();
  if (!post) return null;
  return (
    <div className="my-10">
      <div className="mx-4">
        <Title />
      </div>
      <BuilderContext
        data={JSON.parse(post.page_data as string).rows}
        onSave={(page_data) =>
          updatePostWithDebounce({
            id: post.id,
            page_data: JSON.stringify({ rows: page_data }),
          })
        }
        FileExplorer={FileExplorer}
      >
        <LayoutBuilder />
      </BuilderContext>
    </div>
  );
};
