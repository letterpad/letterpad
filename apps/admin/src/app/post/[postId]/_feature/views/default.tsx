import { Post, Setting } from "graphql-letterpad/dist/graphql";
import { FC } from "react";
import { PostTitlePlaceholder } from "ui";

import { useUpdatePost } from "../api.client";
import { Editor } from "../components/editor";
import { FeaturedImage } from "../components/featured-image";
import { SubTitle } from "../components/subtitle";
import { Title } from "../components/title";
import { WordCount } from "../components/wordCount";

interface Props {
  settings?: Setting;
  post?: Post;
  loading: boolean;
}

export const DefaultPost: FC<Props> = ({ post, settings, loading }) => {
  const { updatePostWithDebounce } = useUpdatePost();

  if (!post) return null;

  return (
    <>
      <div className="prose dark:prose-dark">
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
              onSubtitleChange={(sub_title) => {
                updatePostWithDebounce?.({ sub_title, id: post.id });
              }}
            />
          </div>
          <FeaturedImage id={post.id} cover_image={post.cover_image} />
          <Editor
            hasAiKey={!!settings?.openai_key}
            loading={loading}
            text={post.html_draft || ""}
            onChange={(html) => {
              updatePostWithDebounce?.({ html_draft: html, id: post.id });
            }}
          />
        </div>
      </div>
      <WordCount />
    </>
  );
};
