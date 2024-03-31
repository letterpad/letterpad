import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "ui";

import {
  createPathWithPrefix,
  getLastPartFromPath,
  textToSlug,
} from "@/utils/slug";

import { Heading } from "./heading";

export const Slug = () => {
  const { getValues, control, watch, setValue } =
    useFormContext<PostWithAuthorAndTagsFragment>();
  const post = getValues();

  const formatSlug = (slug: string) => {
    const formattedSlug = createPathWithPrefix(
      textToSlug(getLastPartFromPath(slug)),
      post.type
    );
    return formattedSlug;
  };

  const [slug, setSlug] = useState(
    getLastPartFromPath(
      post?.slug && post.slug?.startsWith("/post/untitled")
        ? formatSlug(post.title) ?? post.slug
        : post.slug!
    )
  );

  const saveSlug = () => {
    const formattedSlug = formatSlug(slug);
    const dirty = watch("slug") !== formattedSlug;
    setValue("slug", formattedSlug, { shouldDirty: dirty });
    setSlug(formattedSlug);
  };

  return (
    <div>
      <Heading
        heading="Path"
        subheading={
          "The URL of your post. Should contain only letters, numbers or hyphen (-) "
        }
      />
      <Controller
        name="slug"
        control={control}
        render={({ field: { onBlur } }) => (
          <Input
            onChange={(e) => setSlug(e.target.value)}
            onBlur={(e) => {
              saveSlug();
              onBlur();
            }}
            value={getLastPartFromPath(slug)}
            addonBefore={`/${post.type}/`}
            // addonAfter={
            //   <a
            //     className="cursor-pointer text-blue-500"
            //     onClick={(e) => {
            //       e.preventDefault();
            //       formatSlug(slug);
            //     }}
            //   >
            //     Validate
            //   </a>
            // }
            onEnter={saveSlug}
            data-testid="slugInp"
            // help={<span className="dark:text-white">Checking...</span>}
          />
        )}
      />
    </div>
  );
};
