import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

import { Heading } from "./heading";

export const ExcludeFromHome: FC = () => {
  const { register, watch } = useFormContext<PostWithAuthorAndTagsFragment>();

  return (
    <div>
      <Heading
        heading="Exclude this post from home page"
        subheading={
          "If you want to display this post under a different menu item, tag it with the menu item name and make sure, that tag is added in navigation menu"
        }
      />
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={watch("exclude_from_home")}
          id="exclude-home"
          {...register("exclude_from_home")}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="exclude-home"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Exclude this post from home page
        </label>
      </div>
    </div>
  );
};
