import { Col, Divider, Drawer, Input, Row, Switch } from "antd";
import React, { useEffect, useMemo, useState } from "react";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import { PostTypes } from "@/__generated__/__types__";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/partial.graphql";
import { useSettingsQuery } from "@/graphql/queries/queries.graphql";
import { subscribe } from "@/shared/eventBus";
import { debounce } from "@/shared/utils";
import {
  createPathWithPrefix,
  getLastPartFromPath,
  textToSlug,
} from "@/utils/slug";

import { getPostHash } from "./api";
import { DeletePost } from "./deletePost";
import PublishButton from "./publishButton";
import QuickMenu from "./quickmenu";
import Tags from "./tags";
import ImageUpload from "../ImageUpload";

const { TextArea } = Input;

interface IProps {
  post: PostWithAuthorAndTagsFragment;
}

const Actions = ({ post }: IProps) => {
  const [visible, setVisible] = useState(false);
  const [postHash, setPostHash] = useState("");
  const settingsResponse = useSettingsQuery();
  const [slug, setSlug] = useState(post.slug);
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
    setSlug(post.slug);
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

  //bad
  const drawerWidth = window.innerWidth > 500 ? 500 : window.innerWidth;

  return (
    <>
      <QuickMenu
        siteUrl={settings?.site_url ?? ""}
        postHash={postHash}
        showDrawer={showDrawer}
      />
      {visible && (
        <Drawer
          title="Settings"
          placement="right"
          closable={true}
          onClose={onClose}
          visible={visible}
          width={drawerWidth}
          zIndex={1000}
          extra={[saving || <span>────</span>]}
          // drawerStyle={{ background: "rgb(var(--sidebar-bg))" }}
        >
          {/* <Space direction="vertical" size="middle"> */}
          <PublishButton postId={post.id} menu={settings?.menu ?? []} />
          <Divider />
          <Row justify="space-between" hidden={true || !isPost} gutter={16}>
            <Col span={20}>Featured</Col>
            <Col span={4}>
              <Switch
                size="small"
                checked={post.featured}
                onChange={(change) => {
                  debounceUpdatePost({
                    id: post.id,
                    featured: change,
                  });
                }}
              />
            </Col>
          </Row>
          <div>
            <label>{postVerb} Description</label>
            <p className="help-text">
              This will be used in displaying your post in your feed, in SEO and
              when sharing in social media.
            </p>
            <TextArea
              showCount
              rows={4}
              maxLength={160}
              onChange={(e) => {
                debounceUpdatePost({ excerpt: e.target.value, id: post.id });
              }}
              defaultValue={post.excerpt}
            />
          </div>
          <Divider />
          <div>
            <label>Path</label>
            <p className="help-text">
              The URL of your post. Should contain only letters, numbers, - and
              should start with /{post.type}/.
            </p>
            <Input.Search
              onChange={(e) => setSlug(e.target.value)}
              value={slug}
              enterButton="Set Path"
              onSearch={formatSlug}
              data-testid="slugInp"
            />
          </div>
          <Divider />
          {isPost && <Tags post={post} />}
          {isPost && <Divider />}
          <div>
            <label>Cover Image</label>
            <p className="help-text">
              Add a cover image to your blog. This image might be used in your
              feed, newsletters, recent posts, sharing in social platform, etc.
            </p>
            <ImageUpload
              name="Cover Image"
              url={post.cover_image.src}
              onDone={([res]) => {
                updatePost({
                  id: post.id,
                  cover_image: {
                    src: res.src,
                    width: res.size.width,
                    height: res.size.height,
                  },
                });
              }}
            />
          </div>
          <Divider />
          <DeletePost postId={post.id} />
        </Drawer>
      )}
      <style jsx global>{`
        .ant-drawer-header {
          border-bottom: 1px solid rgb(var(--color-border));
        }
      `}</style>
    </>
  );
};

export default Actions;
