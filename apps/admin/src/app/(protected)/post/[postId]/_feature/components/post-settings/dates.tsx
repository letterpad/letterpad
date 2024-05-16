import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { useFormContext } from "react-hook-form";
import { Input } from "ui/dist/index.mjs";

import { Heading } from "./heading";

export const Dates = () => {
  const { getValues, register, watch, setValue } =
    useFormContext<PostWithAuthorAndTagsFragment>();
  const post = getValues();

  return (
    <div>
      <div>
        <Heading
          heading="Created At"
          subheading="Change the creation date for a post."
        />

        <Input
          type="date"
          defaultValue={watch("createdAt")?.split("T")[0]}
          {...register("createdAt", {
            onChange: (event) =>
              setValue("createdAt", event.target.value + "T00:00:00Z"),
          })}
        />
      </div>

      {/**
       * Published At
       */}
      {post.publishedAt && (
        <div>
          <Heading
            heading="Published At"
            subheading="Change the creation date for a post."
          />
          <Input
            type="date"
            defaultValue={watch("publishedAt")?.split("T")[0]}
            {...register("publishedAt", {
              onChange: (event) =>
                setValue("publishedAt", event.target.value + "T00:00:00Z"),
            })}
          />
        </div>
      )}
    </div>
  );
};
