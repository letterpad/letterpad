import classNames from "classnames";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";

import Actions from "@/components/post-settings";

import { PostStatusOptions, PostTypes } from "@/__generated__/__types__";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/queries.graphql";

interface Props {
  post: PostWithAuthorAndTagsFragment;
}
const Header: React.VFC<Props> = ({ post }) => {
  const router = useRouter();
  if (!post) return null;

  if (post.__typename === "Post") {
    const className =
      post.status === PostStatusOptions.Published
        ? "bg-green-700"
        : "bg-orange-600";

    const isPost = post.type === PostTypes.Post;

    const goBack = (e) => {
      e.preventDefault();
      router.push(isPost ? "/posts" : "/creatives");
    };
    return (
      <div className="flex flex-row justify-between px-4 py-4">
        <div className="left flex flex-row items-center gap-4">
          <a
            onClick={goBack}
            data-testid="back-button"
            className="cursor-pointer"
          >
            <BsArrowLeft size={24} />
          </a>
          <span
            className={classNames(
              "rounded-md p-1.5 px-2 text-xs text-white shadow-sm",
              className
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

export default Header;
