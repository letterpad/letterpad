import { PostWithAuthorAndTagsFragment, Setting } from "letterpad-graphql";
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
  post?: PostWithAuthorAndTagsFragment;
  loading: boolean;
}

export const DefaultPost: FC<Props> = ({ post, settings, loading }) => {
  const { updatePostWithDebounce } = useUpdatePost();

  if (!post) return null;

  return (
    <>
      <div className="prose dark:prose-dark">
        <div className="content">
          {loading ? <PostTitlePlaceholder /> : <Title />}
          <div className="mt-8">
            <SubTitle />
          </div>
          <FeaturedImage />
          <Editor
            hasAiKey={!!settings?.openai_key}
            loading={loading}
            text={post.html_draft || ""}
            onChange={(html) => {
              updatePostWithDebounce?.(
                { html_draft: html, id: post.id },
                false
              );
            }}
          />
        </div>
      </div>
      <WordCount />
    </>
  );
};
