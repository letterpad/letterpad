import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
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
    setValue("slug", formattedSlug);
  };
  const slug = watch("slug") ?? "";
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
        render={({ field: { onChange } }) => (
          <Input
            onChange={(e) => onChange(e.target.value)}
            value={getLastPartFromPath(slug)}
            addonBefore={`/${post.type}/`}
            addonAfter={
              <a
                className="cursor-pointer text-blue-500"
                onClick={(e) => {
                  e.preventDefault();
                  formatSlug(slug);
                }}
              >
                Validate
              </a>
            }
            onEnter={() => formatSlug(slug)}
            data-testid="slugInp"
            help={<span className="dark:text-white">Checking...</span>}
          />
        )}
      />
    </div>
  );
};
