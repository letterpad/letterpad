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
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-white dark:bg-neutral-900 shadow-md rounded-md">
        {image && (
          <img
            src={image}
            alt="Search Result Image"
            className="mb-4 rounded-md h-36 w-full object-cover"
          />
        )}
        <div>
          <div className="font-bold">{siteTitle}</div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <span className="hover:underline">{url}</span>
          </p>
        </div>
        <h2 className="text-xl font-semibold text-blue-700 mt-2">
          <span className="hover:underline">{title}</span>
        </h2>

        <p className="text-gray-700 mt-2 dark:text-gray-300">{excerpt}</p>
      </div>
    </>
  );
};
