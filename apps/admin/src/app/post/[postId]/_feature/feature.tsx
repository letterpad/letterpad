"use client";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useGetSettings } from "@/app/settings/_feature/api.client";
import { PageType } from "@/graphql/types";

import { useGetPost } from "./api.client";
import { Header } from "./components/header";
import { PostSettingsModal } from "./components/post-settings/drawer";
import { Creatives } from "./views/creatives";
import { DefaultPost } from "./views/default";

export const Feature = () => {
  const { postId } = useParams();
  const [visible, setVisible] = useState(false);
  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  const { data: post, fetching: loading } = useGetPost({ id: String(postId) });
  const { data: settings } = useGetSettings();

  if (loading) return <div></div>;
  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="sticky top-0 dark:bg-slate-900 bg-slate-100 md:bg-transparent lg:z-0 z-10">
        {post && <Header post={post} setShowPostSetting={showDrawer} />}
      </div>

      {post?.page_type === PageType["Default"] && (
        <DefaultPost settings={settings} post={post} loading={loading} />
      )}
      {post?.page_type === PageType["Story Builder"] && (
        <Creatives post={post} />
      )}
      <PostSettingsModal post={post!} visible={visible} onClose={onClose} />
    </div>
  );
};
