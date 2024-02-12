import { FC } from "react";

interface Props {
  title: string;
  url: string;
  excerpt: string;
  image?: string;
  siteTitle: string;
}

export const Preview: FC<Props> = ({
  title,
  url,
  excerpt,
  image,
  siteTitle,
}) => {
  return (
    <>
      <div className="p-1 max-w-3xl mx-auto mt-8 bg-white dark:bg-neutral-800 shadow-md rounded-md flex flex-row gap-2">
        {image && (
          <img
            src={image}
            alt="Search Result Image"
            className="rounded-md h-36 w-24 object-cover"
          />
        )}
        <div>
          <div>
            <div className="font-bold">{siteTitle}</div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <div className="hover:underline text-ellipsis overflow-hidden">
                {url}
              </div>
            </p>
          </div>
          <h2 className="text-sm font-semibold text-blue-700 mt-2 leading-5">
            <span className="hover:underline">{ellipsis(title, 57)}</span>
          </h2>
          <p className="text-gray-700 mt-2 dark:text-gray-300 text-xs">
            {excerpt}
          </p>
        </div>
      </div>
    </>
  );
};

function ellipsis(sentence, maxLength) {
  if (sentence.length <= maxLength) {
    return sentence;
  } else {
    return sentence.substring(0, maxLength) + "...";
  }
}
