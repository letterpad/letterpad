import classNames from "classnames";
import {
  PostStatusOptions,
  PostTypes,
  PostWithAuthorAndTagsFragment,
} from "letterpad-graphql";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { Button } from "ui/dist/index.mjs";

import Actions from "./post-settings";
import { usePublish } from "./post-settings/publish/usePublish";

interface Props {
  post: PostWithAuthorAndTagsFragment;
  setShowPostSetting: (show: boolean) => void;
}

export const Header: React.FC<Props> = ({ post, setShowPostSetting }) => {
  const { isDirty, isPublished, fetching, validateAndPublish } = usePublish({
    postId: post.id,
    menu: [],
  });
  if (!post) return null;

  const canUpdatePublishedPost = isDirty && isPublished;

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
        <div className="right flex flex-row gap-4 items-center">
          {fetching && (
            <span className="saving">
              <span />
              <span />
              <span />
            </span>
          )}
          {canUpdatePublishedPost && (
            <Button
              size="small"
              variant={"link"}
              className="text-green-600 dark:text-green-500 text-sm"
              onClick={validateAndPublish}
            >
              Update
            </Button>
          )}
          <Actions
            key="actions"
            post={post}
            setShowPostSetting={setShowPostSetting}
          />
        </div>
      </div>
    );
  }

  return null;
};
