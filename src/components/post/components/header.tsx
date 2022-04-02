import { PostStatusOptions, PostTypes } from "@/__generated__/__types__";
import { PageHeader, Tag } from "antd";
import { useRouter } from "next/router";
import Actions from "@/components/post-settings";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/queries.graphql";

interface Props {
  post: PostWithAuthorAndTagsFragment;
}
const Header: React.VFC<Props> = ({ post }) => {
  const router = useRouter();
  if (!post) return null;

  if (post.__typename === "Post") {
    const tagColor =
      post.status === PostStatusOptions.Published ? "green" : "orange";

    const isPost = post.type === PostTypes.Post;

    return (
      <PageHeader
        className="site-page-header"
        title="&nbsp;"
        style={{ padding: 10 }}
        onBack={() => router.push(isPost ? "/posts" : "/pages")}
        extra={[<Actions key="actions" post={post} />]}
        tags={
          <Tag color={tagColor} data-testid="postStatus">
            {post.status}
          </Tag>
        }
      ></PageHeader>
    );
  }

  return null;
};

export default Header;
