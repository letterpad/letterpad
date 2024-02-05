import classNames from "classnames";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

import { useUpdatePost } from "../../api.client";

const tags = [
  "health-&-wellness",
  "technology",
  "travel-&-adventure",
  "entertainment",
  "business-&-finance",
  "food-&-cooking",
  "personal-development",
  "science",
  "sports",
  "art-&-creativity",
  "fashion",
  "environment",
  "education",
  "philosophy",
  "social-media",
  "programming",
  "gaming",
  "photography",
  "literature",
  "music",
  "film",
  "design",
  "entrepreneurship",
  "mindfulness",
  "psychology",
  "sustainability",
  "history",
  "astronomy",
  "fitness",
  "diy-crafts",
];

export const WarnNoTags = ({ postId }) => {
  const { updatePost } = useUpdatePost();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      updatePost({
        id: postId,
        tags: selected.map((tag) => ({ name: tag, slug: tag })),
      });
    };
  }, [postId, selected, updatePost]);

  const onClick = (name: string) => {
    setSelected((prev) => [...prev, name]);
  };
  return (
    <div>
      You have not added tags to your post. Tags allow discoverability of your
      post by other authors and readers. You may choose few from below or close
      this window and enter your custom tags.
      <ul className="mt-6 grid md:grid-cols-3 grid-cols-2 font-bold">
        {tags.map((tag) => {
          return (
            <li key={tag}>
              <button
                disabled={selected.includes(tag)}
                onClick={() => onClick(tag)}
                className={classNames({
                  "text-green-500": selected.includes(tag),
                  "hover:text-blue-500": !selected.includes(tag),
                })}
              >
                {tag}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const TagNotLinkedWithNavigation: FC<{ tags: string[] }> = ({
  tags,
}) => {
  const hasTags = tags.length > 0;
  const tagsCount = tags.length;
  const plural = tagsCount > 1;
  const tagsStr = tags.join(", ");

  return (
    <div>
      Atleast one tag of this post should be linked in Navigation. <br />
      <br />
      {hasTags && (
        <p>
          Currently the navigation menu has {plural ? "these tags" : "the tag"}{" "}
          - <strong className="italic">{tagsStr}</strong>. You need to link one
          of the tag from this Post to the Navigation Menu so that this post is
          visible in your website. You can do so by going to{" "}
          <Link
            href="/settings?selected=navigation"
            className="text-blue-500 hover:text-blue-700"
          >
            Settings → Navigation
          </Link>{" "}
          → New. Then give a name and select a tag by clicking content.
        </p>
      )}
      <br />
      <a
        target="_blank"
        href="https://docs.letterpad.app/navigation-menu"
        rel="noreferrer"
        className="text-blue-500 hover:text-blue-700"
      >
        Click here
      </a>{" "}
      to know more.
    </div>
  );
};

export const PageNotLinkedWithNavigation = () => {
  return (
    <div>
      This page has has not been linked with Navigation. Without linking, the
      page wont be displayed in your blog.
      <br />
      You can link this page by going to{" "}
      <Link
        href="/settings?selected=navigation"
        className="text-blue-500 hover:text-blue-700"
      >
        Settings → Navigation
      </Link>{" "}
      → New. Then give a name and select this page by clicking Content.
      <br />
      <a
        target="_blank"
        href="https://docs.letterpad.app/navigation-menu"
        rel="noreferrer"
        className="text-blue-500 hover:text-blue-700"
      >
        Click here
      </a>{" "}
      to know more.
    </div>
  );
};
