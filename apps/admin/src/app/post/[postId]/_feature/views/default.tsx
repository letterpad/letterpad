import { FC } from "react";
import { PostTitlePlaceholder } from "ui";

import { FontPageWrapper } from "@/components/fonts";

import { Post, PostStatusOptions, Setting } from "@/__generated__/__types__";

import { Editor } from "../components/editor";
import { FeaturedImage } from "../components/featured-image";
import { SubTitle } from "../components/subtitle";
import { Title } from "../components/title";
import { WordCount } from "../components/wordCount";

interface Props {
  settings?: Setting;
  post?: Post;
  loading: boolean;
  onEditorChange?: (html: string, id: number) => void;
}

export const DefaultPost: FC<Props> = ({
  post,
  settings,
  loading,
  onEditorChange,
}) => {
  if (!post) return null;
  let content = post?.html;
  if (
    post?.status === PostStatusOptions.Draft ||
    post?.status === PostStatusOptions.Trashed
  ) {
    content = post?.html_draft;
  }

  return (
    <FontPageWrapper
      primary_font={(settings?.design?.primary_font as any) ?? "Inter"}
      secondary_font={(settings?.design?.secondary_font as any) ?? "PT_Serif"}
      className="prose dark:prose-dark"
    >
      <div className="content">
        {loading ? (
          <PostTitlePlaceholder />
        ) : (
          <Title title={post?.title || ""} postId={post?.id} />
        )}
        <div className="mt-8">
          <SubTitle postId={post?.id} sub_title={post?.sub_title || ""} />
        </div>
        <FeaturedImage id={post.id} cover_image={post.cover_image} />
        <Editor
          loading={loading}
          text={content ?? ""}
          onChange={(html) => {
            onEditorChange?.(html, post.id);
          }}
        />
      </div>
      <WordCount />
    </FontPageWrapper>
  );
};
