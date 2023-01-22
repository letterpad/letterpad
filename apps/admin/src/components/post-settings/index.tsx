import classNames from "classnames";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Drawer, Input, Switch, TextArea } from "ui";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import { Upload } from "@/components/upload";

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
import { QuickMenu } from "./quickmenu";
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
    [updatePost]
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
      post.type
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
        preview={post.page_type !== PageType["Story Builder"]}
        siteUrl={settings?.site_url ?? ""}
        postHash={postHash}
        showDrawer={showDrawer}
      />
      <Drawer show={visible} title="Settings" onClose={onClose} dir="right">
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
            <Heading heading="Path" subheading={""} />
            <Input
              onChange={(e) => setSlug(e.target.value)}
              value={getLastPartFromPath(slug)}
              addonBefore={`/${post.type}/`}
              addonAfter={
                <a
                  className="cursor-pointer text-blue-500"
                  onClick={(e) => {
                    e.preventDefault();
                    formatSlug(slug);
                  }}
                >
                  Validate
                </a>
              }
              label="The URL of your post. Should contain only letters, numbers or hyphen (-) "
              onEnter={() => formatSlug(slug)}
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
        </div>
      </Drawer>
    </>
  );
};

export default Actions;

const Heading = ({ heading, subheading }) => {
  return (
    <>
      <label className="font-bold">{heading}</label>
      <p className="help-text mb-4 mt-2">{subheading}</p>
    </>
  );
};
