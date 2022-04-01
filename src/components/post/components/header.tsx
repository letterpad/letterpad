import { usePostContext } from "@/components/post/context";
import {
  NavigationType,
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/__types__";
import { LoadingOutlined } from "@ant-design/icons";
import { PageHeader, Tag } from "antd";
import { useRouter } from "next/router";
import Actions from "@/components/post-meta";
import { PostContextType } from "../types";
import { getLastPartFromPath } from "@/utils/slug";

const Header: React.FC = () => {
  const router = useRouter();
  const { post, setPostAttribute, updating, settings } =
    usePostContext() as PostContextType;

  if (!post) return null;

  const navigationTags = settings?.menu
    .filter(
      (a) => a.type === NavigationType.Tag && post?.type === PostTypes.Post,
    )
    .map((a) => getLastPartFromPath(a.slug));

  const navigationPages = settings?.menu
    .filter(
      (a) => a.type === NavigationType.Page && post?.type === PostTypes.Page,
    )
    .map((a) => getLastPartFromPath(a.slug));

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
        extra={[
          <LoadingOutlined spin hidden={!updating} key="updating" />,
          <Actions
            key="actions"
            post={post}
            setPostAttribute={setPostAttribute}
            deletePost={() => {
              setPostAttribute({ status: PostStatusOptions.Trashed });
              router.push(isPost ? "/posts" : "/pages");
            }}
            navigationTags={navigationTags}
            navigationPages={navigationPages}
          />,
        ]}
        tags={<Tag color={tagColor}>{post.status}</Tag>}
      ></PageHeader>
    );
  }

  return null;
};

export default Header;
