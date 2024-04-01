"use client";
import classNames from "classnames";
import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useGetSettings } from "@/app/settings/_feature/api.client";
import { PageType } from "@/graphql/types";

import { useGetPost } from "./api.client";
import { AutoSaveForm } from "./AutoSaveForm";
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

  const methods = useForm<PostWithAuthorAndTagsFragment | {}>({
    values: post || {},
    mode: "all",
    reValidateMode: "onBlur",
  });

  if (loading) return <div></div>;
  const isStoryBuilder = post?.page_type === "story-builder";

  return (
    <div style={{ minHeight: "100vh" }}>
      <FormProvider {...methods}>
        <AutoSaveForm defaultValue={post} />
        <div
          className={classNames(
            "sticky top-0 dark:bg-slate-900 bg-slate-100 md:bg-transparent lg:z-0 z-10",
            {
              "px-4": isStoryBuilder,
            }
          )}
        >
          {post && <Header post={post} setShowPostSetting={showDrawer} />}
        </div>

        {post?.page_type === PageType["Default"] && (
          <DefaultPost settings={settings} post={post} loading={loading} />
        )}
        {isStoryBuilder && <Creatives post={post} />}

        <PostSettingsModal visible={visible} onClose={onClose} />
      </FormProvider>
    </div>
  );
};
