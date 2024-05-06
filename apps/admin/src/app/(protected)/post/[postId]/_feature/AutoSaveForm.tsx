import {
  InputUpdatePost,
  PostWithAuthorAndTagsFragment,
} from "letterpad-graphql";
import { useFormContext, useWatch } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";

import { dirtyValues } from "@/shared/utils";

import { useUpdatePost } from "./api.client";

export const AutoSaveForm = ({ defaultValue }) => {
  const methods = useFormContext<PostWithAuthorAndTagsFragment>();
  const { updatePostWithDebounce } = useUpdatePost();
  const watchedData = useWatch<PostWithAuthorAndTagsFragment>({
    control: methods.control,
    defaultValue,
  });

  const onSubmit = async (data: PostWithAuthorAndTagsFragment) => {
    const change = dirtyValues(methods.formState.dirtyFields, data);
    const update: InputUpdatePost = { id: data?.id! };

    if ("title" in change) update.title = change.title;
    if ("sub_title" in change) update.sub_title = change.sub_title;
    if (change.cover_image)
      update.cover_image = {
        ...change.cover_image,
        src: change.cover_image?.src ?? "",
      };
    if ("html" in change) update.html = change.html;
    if ("html_draft" in change) update.html_draft = change.html_draft;
    if ("excerpt" in change) update.excerpt = change.excerpt;
    if ("slug" in change) update.slug = change.slug;
    if ("publishedAt" in change) update.publishedAt = change.publishedAt;
    if ("createdAt" in change) update.createdAt = change.createdAt;
    if ("mail_status" in change) update.mail_status = change.mail_status;
    if ("html_draft" in change) update.html_draft = change.html_draft;
    if ("status" in change) update.status = change.status;
    if ("exclude_from_home" in change)
      update.exclude_from_home = change.exclude_from_home;
    if ("tags" in change)
      update.tags = change.tags?.["rows"]?.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
      }));
    const post = await updatePostWithDebounce(update);
    if (post.data?.updatePost.__typename === "Post") {
      methods.reset({ ...change, ...post.data?.updatePost });
    }
  };

  const updatePost = async () => {
    methods.handleSubmit(onSubmit)();
  };

  useDeepCompareEffect(() => {
    if (methods.formState.isDirty && defaultValue.id) {
      updatePost();
    }
  }, [watchedData]);

  return null;
};
