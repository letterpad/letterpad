import classNames from "classnames";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

import { PostStatusOptions, PostTypes } from "@/__generated__/__types__";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/queries.graphql";

import Actions from "./post-settings";

interface Props {
  post: PostWithAuthorAndTagsFragment;
}

export const Header: React.VFC<Props> = ({ post }) => {
  if (!post) return null;

  if (post.__typename === "Post") {
    const isPost = post.type === PostTypes.Post;
    return (
      <div className="flex flex-row justify-between py-4">
        <div className="left flex flex-row items-center gap-4">
          <Link
            href={isPost ? "/posts" : "/creatives"}
            data-testid="back-button"
            className="cursor-pointer"
          >
            <BsArrowLeft size={24} />
          </Link>
          <span
            className={classNames(
              "rounded-md p-1.5 px-2 text-xs  font-semibold uppercase tracking-wide",
              {
                "text-green-500": post.status === PostStatusOptions.Published,
                "text-orange-500": post.status === PostStatusOptions.Draft,
              }
            )}
            data-testid="postStatus"
          >
            {post.status}
          </span>
        </div>
        <div className="right">
          <Actions key="actions" post={post} />
        </div>
      </div>
    );
  }

  return null;
};
