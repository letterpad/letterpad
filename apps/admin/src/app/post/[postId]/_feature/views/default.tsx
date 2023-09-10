import Link from "next/link";
import { FC, useState } from "react";
import { AiOutlineHistory } from "react-icons/ai";
import { PostTitlePlaceholder } from "ui";

import { FontPageWrapper } from "@/components/fonts";

import { Post, Setting } from "@/__generated__/__types__";

import { useUpdatePost } from "../api.client";
import { Editor } from "../components/editor";
import { FeaturedImage } from "../components/featured-image";
import { PostTimelineModal } from "../components/postTimelineModal";
import { SubTitle } from "../components/subtitle";
import { Title } from "../components/title";
import { WordCount } from "../components/wordCount";
import { usePostVersioning } from "../hooks";

interface Props {
  settings?: Setting;
  post?: Post;
  loading: boolean;
}

export const DefaultPost: FC<Props> = ({ post, settings, loading }) => {
  const { initialContent, versionManager } = usePostVersioning(post?.id!);
  const { updatePost, updatePostWithDebounce } = useUpdatePost(post?.id!);
  const [showTimeline, setShowTimeline] = useState(false);

  if (!post) return null;

  return (
    <FontPageWrapper
      primary_font={(settings?.design?.primary_font as any) ?? "Inter"}
      secondary_font={(settings?.design?.secondary_font as any) ?? "PT_Serif"}
      className="prose dark:prose-dark"
    >
      <div className="fixed bottom-10 left-4">
        <Link href="#" onClick={() => setShowTimeline(true)}>
          <span className="flex items-center gap-1 text-sm text-slate-400">
            <AiOutlineHistory size={16} />
            History
          </span>
        </Link>
      </div>
      <div className="content">
        {loading ? (
          <PostTitlePlaceholder />
        ) : (
          <Title
            title={post?.title || ""}
            postId={post?.id}
            onTitleChange={(title) => {
              updatePostWithDebounce?.({ title, id: post.id });
            }}
          />
        )}
        <div className="mt-8">
          <SubTitle
            postId={post?.id}
            sub_title={post?.sub_title || ""}
            onSubtitleChange={(title) => {
              updatePostWithDebounce?.({ title, id: post.id });
            }}
          />
        </div>
        <FeaturedImage id={post.id} cover_image={post.cover_image} />
        <Editor
          loading={loading}
          text={initialContent}
          onChange={(html) => {
            updatePostWithDebounce?.({ html_draft: html, id: post.id });
          }}
        />
      </div>
      <WordCount />
      <PostTimelineModal
        onClose={() => setShowTimeline(false)}
        visible={showTimeline}
        onApply={(version) => {
          window["tinymce"].get("main-editor").setContent(version?.change);
          versionManager.updateBlog(version?.change ?? "");
          updatePost?.({
            html_draft: version?.change,
            id: post.id,
          });
        }}
      />
    </FontPageWrapper>
  );
};
