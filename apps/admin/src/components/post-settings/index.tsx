import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import { Drawer as Drawerv2 } from "@/components_v2/drawer";
import { SearchInput } from "@/components_v2/input";
import { Switch } from "@/components_v2/switch";
import { TextArea } from "@/components_v2/textarea";
import { Upload } from "@/components_v2/upload";

import { PostTypes } from "@/__generated__/__types__";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/partial.graphql";
import { useSettingsQuery } from "@/graphql/queries/queries.graphql";
import { PageType } from "@/graphql/types";
import { subscribe } from "@/shared/eventBus";
import { debounce } from "@/shared/utils";
import {
  createPathWithPrefix,
  getLastPartFromPath,
  textToSlug,
} from "@/utils/slug";

import { getPostHash } from "./api";
import PublishButton from "./publishButton";
import QuickMenu from "./quickmenu";
import Tags from "./tags";

interface IProps {
  post: PostWithAuthorAndTagsFragment;
}

const Actions = ({ post }: IProps) => {
  const [visible, setVisible] = useState(false);
  const [postHash, setPostHash] = useState("");
  const settingsResponse = useSettingsQuery();
  const [slug, setSlug] = useState(post.slug || "");
  const [saving, setSaving] = useState("");
  const { updatePost } = useUpdatePost();
  const debounceUpdatePost = useMemo(
    () => debounce((data) => updatePost(data), 500),
    [updatePost],
  );

  useEffect(() => {
    getPostHash(post.id).then(setPostHash);
  }, [post.id]);

  useEffect(() => {
    if (post.slug) setSlug(post.slug);
  }, [post.slug]);

  useEffect(() => {
    subscribe("save", (msg) => {
      setSaving(msg);
      setTimeout(() => {
        setSaving("");
      }, 2000);
    });
  }, []);

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  const formatSlug = (slug: string) => {
    const formattedSlug = createPathWithPrefix(
      textToSlug(getLastPartFromPath(slug)),
      post.type,
    );
    setSlug(formattedSlug);
    debounceUpdatePost({ id: post.id, slug: formattedSlug });
  };

  if (post.__typename !== "Post") return null;

  const isPost = post.type === PostTypes.Post;
  const postVerb = isPost ? "Post" : "Page";

  const settings =
    settingsResponse.data?.settings.__typename === "Setting"
      ? settingsResponse.data?.settings
      : undefined;

  return (
    <>
      <QuickMenu
        grammar={post.page_type !== PageType["Story Builder"]}
        preview={post.page_type !== PageType["Story Builder"]}
        siteUrl={settings?.site_url ?? ""}
        postHash={postHash}
        showDrawer={showDrawer}
      />
      <Drawerv2 show={visible} title="Settings" onClose={onClose} dir="right">
        <div className="space-y-10 whitespace-normal">
          <PublishButton postId={post.id} menu={settings?.menu ?? []} />
          <div
            className={classNames({
              hidden: true || !isPost,
            })}
          >
            <Switch
              label="Featured"
              active={post.featured}
              onChange={(change) => {
                debounceUpdatePost({
                  id: post.id,
                  featured: change,
                });
              }}
            />
          </div>
          <div>
            <Heading
              heading={`${postVerb} Description`}
              subheading={`This will be used in displaying your post in your feed, in SEO and
              when sharing in social media.`}
            />
            <TextArea
              rows={4}
              maxLength={160}
              onChange={(e) => {
                debounceUpdatePost({ excerpt: e.target.value, id: post.id });
              }}
              defaultValue={post.excerpt ?? ""}
            />
          </div>
          <div>
            <Heading
              heading="Path"
              subheading={`The URL of your post. Should contain only letters, numbers, - and
              should start with /${post.type}/.`}
            />
            <SearchInput
              onChange={(e) => setSlug(e.target.value)}
              value={slug}
              enterButton="Validate"
              onSearch={formatSlug}
              data-testid="slugInp"
            />
          </div>
          {isPost && (
            <Tags
              post={post}
              header={
                <Heading
                  heading="Tags"
                  subheading={
                    <>
                      Tags are used to group your posts together. Without tags,
                      your post wont be visible in your blog. Add a tag and
                      ensure its linked with navigation.{" "}
                      <a href="https://docs.letterpad.app/navigation-menu">
                        Learn more
                      </a>
                    </>
                  }
                />
              }
            />
          )}
          <div>
            <Heading
              heading="Cover Image"
              subheading="Add a cover image to your blog. This image might be used in your
              feed, newsletters, recent posts, sharing in social platform, etc."
            />
            <Upload
              url={post.cover_image.src || ""}
              onSuccess={([res]) => {
                updatePost({
                  id: post.id,
                  cover_image: {
                    src: res?.src,
                    width: res.size?.width,
                    height: res.size?.height,
                  },
                });
              }}
            />
          </div>
        </div>
      </Drawerv2>
    </>
  );
};

export default Actions;

const Heading = ({ heading, subheading }) => {
  return (
    <>
      <label className="font-bold">{heading}</label>
      <p className="help-text mb-4">{subheading}</p>
    </>
  );
};
