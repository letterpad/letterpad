import { useUpdatePost } from "@/hooks/useUpdatePost";

import { Buttonv2 } from "@/components_v2/button";

import {
  Navigation,
  NavigationType,
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/__types__";
import { usePostQuery } from "@/__generated__/queries/queries.graphql";
import { EventAction, track } from "@/track";

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
    const postTags = post.tags?.__typename === "TagsNode" ? post.tags.rows : [];

    const navLinkedWithTags = postTags.find((tag) =>
      navigationTags?.includes(tag.name.toLowerCase()),
    );
    const navLinkedWithPages = navigationPages?.find(
      (page) => page === post.slug?.replace("/page/", "").toLowerCase(),
    );

    if (active) {
      if (post.type === PostTypes.Post) {
        if (postTags.length === 0) return warnNoTags();
        if (!navLinkedWithTags)
          return tagNotLinkedWithNavigation(navigationTags);
      } else {
        if (!navLinkedWithPages) return pageNotLinkedWithNavigation();
      }
    }
    const status = active
      ? PostStatusOptions.Published
      : PostStatusOptions.Draft;
    if (active) {
      track({
        eventAction: EventAction.Click,
        eventCategory: "post status",
        eventLabel: "publish",
      });
    }
    updatePost({ id: postId, status });
  };

  const published = post.status === PostStatusOptions.Published;

  return (
    <>
      <div className="flex flex-col gap-4">
        {!published && (
          <>
            <label>Ready to publish your {post.type} ?</label>

            <Buttonv2
              variant="success"
              size="normal"
              onClick={() => publish(true)}
              data-testid="publishBtn"
              className="button btn-success"
            >
              Publish
            </Buttonv2>
          </>
        )}
        {published && (
          <>
            <label className="flex flex-col">
              Unpublish this {post.type} ? &nbsp;
              <span className="help-text mb-4 block">
                Your {post.type} will no longer be visible to users.
              </span>
              <Buttonv2
                variant="dark"
                onClick={() => publish(false)}
                data-testid="unPublishBtn"
              >
                Un-Publish
              </Buttonv2>
            </label>
          </>
        )}
      </div>
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
