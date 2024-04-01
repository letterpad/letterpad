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

    if (change.title) update.title = change.title;
    if (change.sub_title) update.sub_title = change.sub_title;
    if (change.cover_image)
      update.cover_image = {
        ...change.cover_image,
        src: change.cover_image?.src ?? "",
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
