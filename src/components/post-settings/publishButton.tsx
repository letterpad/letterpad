import { useUpdatePost } from "@/hooks/useUpdatePost";
import { usePostQuery } from "@/__generated__/queries/queries.graphql";
import {
  Navigation,
  NavigationType,
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/__types__";
import { Col, Row, Switch } from "antd";
import {
  pageNotLinkedWithNavigation,
  tagNotLinkedWithNavigation,
  warnNoTags,
} from "./warnings";

interface Props {
  postId: number;
  menu: Navigation[];
  tags: any;
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
      navigationTags?.includes(tag.name),
    );
    const navLinkedWithPages = navigationPages?.find(
      (page) => page === post.slug?.replace("/page/", ""),
    );

    if (active) {
      if (post.type === PostTypes.Post) {
        if (post.tags?.length === 0) return warnNoTags();
        if (!navLinkedWithTags) return tagNotLinkedWithNavigation();
      } else {
        if (!navLinkedWithPages) return pageNotLinkedWithNavigation();
      }
    }
    const status = active
      ? PostStatusOptions.Published
      : PostStatusOptions.Draft;

    updatePost({ id: postId, status });
  };

  return (
    <Row justify="space-between" gutter={16}>
      <Col span={20}>Published</Col>
      <Col span={4}>
        <Switch
          size="small"
          checked={post.status === PostStatusOptions.Published}
          onChange={publish}
        />
      </Col>
    </Row>
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
