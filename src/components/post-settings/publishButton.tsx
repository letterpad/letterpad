import { useUpdatePost } from "@/hooks/useUpdatePost";
import { usePostQuery } from "@/__generated__/queries/queries.graphql";
import {
  Navigation,
  NavigationType,
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/__types__";
import { Button, Space } from "antd";
import {
  pageNotLinkedWithNavigation,
  tagNotLinkedWithNavigation,
  warnNoTags,
} from "./warnings";

interface Props {
  postId: number;
  menu: Navigation[];
}

const PublishButton: React.VFC<Props> = ({ postId, menu }) => {
  const { data, loading } = usePostQuery({
    variables: { filters: { id: postId } },
  });

  const { updatePost } = useUpdatePost();

  if (loading) return <span>loading...</span>;
  if (data?.post.__typename !== "Post") return null;

  const { post } = data;

  const publish = (active: boolean) => {
    const navigationTags = getTagsFromMenu(menu);
    const navigationPages = getPagesFromMenu(menu);

    const navLinkedWithTags = post.tags?.find((tag) =>
      navigationTags?.includes(tag.name.toLowerCase()),
    );
    const navLinkedWithPages = navigationPages?.find(
      (page) => page === post.slug?.replace("/page/", "").toLocaleLowerCase(),
    );

    if (active) {
      if (post.type === PostTypes.Post) {
        if (post.tags?.length === 0) return warnNoTags();
        if (!navLinkedWithTags)
          return tagNotLinkedWithNavigation(navigationTags);
      } else {
        if (!navLinkedWithPages) return pageNotLinkedWithNavigation();
      }
    }
    const status = active
      ? PostStatusOptions.Published
      : PostStatusOptions.Draft;

    updatePost({ id: postId, status });
  };

  const published = post.status === PostStatusOptions.Published;
  const canRePublish = !!post.html_draft?.length && published;

  const rePublish = () => {
    updatePost({
      id: postId,
      status: PostStatusOptions.Published,
    });
  };

  return (
    <>
      <Space direction="vertical" style={{ display: "flex" }}>
        {!published && (
          <>
            <p>
              <label>Ready to publish your {post.type} ?</label>
            </p>
            <Button
              type="primary"
              block
              size="large"
              style={{ fontSize: 14 }}
              onClick={() => publish(true)}
              data-testid="publishBtn"
            >
              Publish
            </Button>
          </>
        )}
        {canRePublish && (
          <>
            <p>
              <label>Update your published content ?</label>
              <p className="help-text">
                Your {post.type} is live. This will update the content of your{" "}
                {post.type}.
              </p>
            </p>
            <Button
              type="primary"
              block
              size="large"
              style={{ fontSize: 14 }}
              onClick={rePublish}
              data-testid="rePublishBtn"
            >
              Update Content
            </Button>
            <br />
          </>
        )}
        {published && (
          <>
            <label>
              Unpublish this {post.type} ? &nbsp;
              <p className="help-text">
                Your {post.type} will no longer be visible to users.
              </p>
              <Button
                type="primary"
                onClick={() => publish(false)}
                data-testid="unPublishBtn"
              >
                Un-Publish
              </Button>
            </label>
          </>
        )}
      </Space>
    </>
  );
};

export default PublishButton;

function getTagsFromMenu(menu: Navigation[]) {
  return menu
    .filter((a) => a.type === NavigationType.Tag)
    .map((a) => a.slug.replace("/tag/", "").toLowerCase());
}
function getPagesFromMenu(menu: Navigation[]) {
  return menu
    .filter((a) => a.type === NavigationType.Page)
    .map((a) => a.slug.replace("/page/", "").toLowerCase());
}
