import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import { AiOutlineHistory } from "react-icons/ai";
import { Button, Modal, PostTitlePlaceholder } from "ui";

import { FontPageWrapper } from "@/components/fonts";

import { InputUpdatePost, Post, Setting } from "@/__generated__/__types__";

import { useGetPost } from "../api.client";
import { Editor } from "../components/editor";
import { FeaturedImage } from "../components/featured-image";
import { SubTitle } from "../components/subtitle";
import { Title } from "../components/title";
import { WordCount } from "../components/wordCount";
import { Timeline } from "../../../../../components/timeline";
import { History, PostVersion } from "../../../../../lib/versioning";

interface Props {
  settings?: Setting;
  post?: Post;
  loading: boolean;
  onEditorChange?: (props: InputUpdatePost) => void;
}

export const DefaultPost: FC<Props> = ({
  post,
  settings,
  loading,
  onEditorChange,
}) => {
  const { data } = useGetPost({ id: post?.id });
  const ref = useRef(new PostVersion(parseDrafts(data?.html_draft)));
  const [showTimeline, setShowTimeline] = useState(false);
  const [content, setContent] = useState("");
  const [tempTimelineData, setTempTimelineData] = useState<{
    timestamp: string;
    change: string;
  } | null>(null);

  useEffect(() => {
    ref.current = new PostVersion(parseDrafts(data?.html_draft));
  }, [data?.html_draft]);

  useEffect(() => {
    onActivate(
      ref.current.getHistory()[ref.current.getHistory().length - 1]?.timestamp
    );
  }, []);

  const onActivate = (timestamp: string) => {
    setContent(ref.current.retrieveBlogAtTimestamp(timestamp) ?? "");
  };

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
              onEditorChange?.({ title, id: post.id });
            }}
          />
        )}
        <div className="mt-8">
          <SubTitle
            postId={post?.id}
            sub_title={post?.sub_title || ""}
            onSubtitleChange={(title) => {
              onEditorChange?.({ title, id: post.id });
            }}
          />
        </div>
        <FeaturedImage id={post.id} cover_image={post.cover_image} />
        <Editor
          loading={loading}
          text={content}
          onChange={(html) => {
            onEditorChange?.({ html_draft: html, id: post.id });
          }}
        />
      </div>
      <WordCount />
      <Modal
        header="Post Timeline"
        show={showTimeline}
        size="lg"
        toggle={() => setShowTimeline(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setShowTimeline(false)}
            variant="ghost"
            data-testid="cancelModalBtn"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            variant="primary"
            onClick={() => {
              setShowTimeline(false);
              window["tinymce"]
                .get("main-editor")
                .setContent(tempTimelineData?.change);
              ref.current.updateBlog(tempTimelineData?.change ?? "");
              onEditorChange?.({
                html_draft: tempTimelineData?.change,
                id: post.id,
              });
            }}
            disabled={false}
          >
            Apply
          </Button>,
        ]}
      >
        <div className="flex gap-4 px-16">
          <Timeline onTimelineChange={setTempTimelineData} />
        </div>
      </Modal>
    </FontPageWrapper>
  );
};

function parseDrafts(drafts) {
  try {
    return JSON.parse(drafts);
  } catch (e) {
    return [
      { content: drafts, timestamp: new Date().toISOString(), patches: [] },
    ];
  }
}
