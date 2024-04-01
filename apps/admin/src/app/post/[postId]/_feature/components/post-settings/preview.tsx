import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

import { Heading } from "./heading";

interface Props {
  url: string;
  siteTitle: string;
}

export const Preview: FC<Props> = ({ url, siteTitle }) => {
  const { watch } = useFormContext<PostWithAuthorAndTagsFragment>();
  return (
    <div>
      <Heading
        heading="Story Preview"
        subheading={
          "This is how various search engines and social posting will look like."
        }
      />
      <div className="p-4 max-w-3xl mx-auto mt-8 bg-white dark:bg-slate-800 shadow-md rounded-md flex flex-row gap-2">
        {watch("cover_image.src") && (
          <img
            src={watch("cover_image.src")}
            alt="Search Result Image"
            className="rounded-md h-36 w-24 object-cover"
          />
        )}
        <div>
          <div>
            <div className="font-bold">{siteTitle}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              <div className="hover:underline text-ellipsis overflow-hidden">
                {url}
              </div>
            </div>
          </div>
          <h2 className="text-sm font-semibold text-blue-500 mt-2 leading-5">
            <span className="hover:underline">
              {ellipsis(watch("title"), 57)}
            </span>
          </h2>
          <p className="text-gray-700 mt-2 dark:text-gray-300 text-xs">
            {watch("excerpt")}
          </p>
        </div>
      </div>
    </div>
  );
};

function ellipsis(sentence, maxLength) {
  if (sentence?.length <= maxLength) {
    return sentence;
  } else {
    return sentence?.substring(0, maxLength) + "...";
  }
}
