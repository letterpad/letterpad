import { PostWithAuthorAndTagsFragment, Setting } from "letterpad-graphql";
import { FC, useState } from "react";
import { Button, PostTitlePlaceholder } from "ui";

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
  const [busy, setBusy] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const showSuggestions = async () => {
    try {
      setBusy(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: post?.html_draft,
          field: "html_draft",
        }),
      });
      const text = await response.text();
      setSuggestion(text);
      // setValue("excerpt", text);
    } catch (e) {}
    setBusy(false);
  };
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
          <Button onClick={showSuggestions}>Suggestions</Button>
          <div dangerouslySetInnerHTML={{ __html: suggestion }} />
          <div>------------------------------------------------</div>
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
