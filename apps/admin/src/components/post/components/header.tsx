import { PageHeader, Tag } from "antd";
import classNames from "classnames";
import { useRouter } from "next/router";

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

    return (
      <PageHeader
        className="site-page-header"
        title="&nbsp;"
        style={{ padding: 10 }}
        onBack={() => router.push(isPost ? "/posts" : "/creatives")}
        extra={[<Actions key="actions" post={post} />]}
        tags={
          <span
            className={classNames(
              "rounded-md p-1.5 px-2 text-xs text-white shadow-md",
              className,
            )}
            data-testid="postStatus"
          >
            {post.status}
          </span>
        }
      ></PageHeader>
    );
  }

  return null;
};

export default Header;
