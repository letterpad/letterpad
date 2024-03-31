"use client";
import classNames from "classnames";
import {
  InputUpdatePost,
  PostWithAuthorAndTagsFragment,
} from "letterpad-graphql";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";

import { useGetSettings } from "@/app/settings/_feature/api.client";
import { PageType } from "@/graphql/types";

import { useGetPost, useUpdatePost } from "./api.client";
import { Header } from "./components/header";
import { PostSettingsModal } from "./components/post-settings/drawer";
import { Creatives } from "./views/creatives";
import { DefaultPost } from "./views/default";
export const Feature = () => {
  const { postId } = useParams();
  const [visible, setVisible] = useState(false);
  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);
  const { updatePostWithDebounce } = useUpdatePost();

  const { data: post, fetching: loading } = useGetPost({ id: String(postId) });
  const { data: settings } = useGetSettings();

  const methods = useForm<PostWithAuthorAndTagsFragment | {}>({
    values: post || {},
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: PostWithAuthorAndTagsFragment) => {
    const change = dirtyValues(methods.formState.dirtyFields, data);
    const update: InputUpdatePost = { id: data?.id! };

    if (change.title) update.title = change.title;
    if (change.sub_title) update.sub_title = change.sub_title;
    if (change.cover_image?.src)
      update.cover_image = {
        ...change.cover_image,
        src: change.cover_image.src,
      };
    if (change.html) update.html = change.html;
    if (change.html_draft) update.html_draft = change.html_draft;
    if (change.excerpt) update.excerpt = change.excerpt;
    if (change.slug) update.slug = change.slug;
    if (change.publishedAt) update.publishedAt = change.publishedAt;
    if (change.createdAt) update.createdAt = change.createdAt;
    if (change.mail_status) update.mail_status = change.mail_status;
    if (change.html_draft) update.html_draft = change.html_draft;
    if (change.status) update.status = change.status;
    if (change.exclude_from_home)
      update.exclude_from_home = change.exclude_from_home;
    if (change.tags)
      update.tags = change.tags?.["rows"]?.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
      }));
    await updatePostWithDebounce(update);
    methods.reset({ ...post, ...update });
  };

  if (loading) return <div></div>;
  const isStoryBuilder = post?.page_type === "story-builder";

  return (
    <div style={{ minHeight: "100vh" }}>
      <FormProvider {...methods}>
        <AutoSaveForm defaultValue={post} onSubmit={onSubmit} />

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

const AutoSaveForm = ({ defaultValue, onSubmit }) => {
  const methods = useFormContext<PostWithAuthorAndTagsFragment>();

  const watchedData = useWatch<PostWithAuthorAndTagsFragment>({
    control: methods.control,
    defaultValue,
  });

  const updatePost = async () => {
    methods.handleSubmit(onSubmit)();
  };

  useDeepCompareEffect(() => {
    if (methods.formState.isDirty) {
      updatePost();
    }
  }, [watchedData]);

  return null;
};

export function dirtyValues<T>(
  dirtyFields: object | boolean,
  allValues: T
): Partial<T> {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;
  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      dirtyValues(dirtyFields[key], allValues[key]),
    ])
  ) as Partial<T>;
}
