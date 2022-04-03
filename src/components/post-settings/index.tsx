import React, { useState, useEffect } from "react";
import { Row, Col, Input, Drawer, Switch, Divider } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import ImageUpload from "../ImageUpload";
import { PostTypes } from "@/__generated__/__types__";
import Tags from "./tags";
import { useSettingsQuery } from "@/graphql/queries/queries.graphql";
import { getPostHash } from "./api";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/partial.graphql";
import PublishButton from "./publishButton";
import QuickMenu from "./quickmenu";
import { useUpdatePost } from "@/hooks/useUpdatePost";
import { DeletePost } from "./deletePost";
import { Dropdown } from "antd";
import {
  createPathWithPrefix,
  getLastPartFromPath,
  textToSlug,
} from "@/utils/slug";
import { subscribe } from "@/shared/eventBus";

const { TextArea } = Input;

interface IProps {
  post: PostWithAuthorAndTagsFragment;
}

const Actions = ({ post }: IProps) => {
  const [visible, setVisible] = useState(false);
  const [postHash, setPostHash] = useState("");
  const settingsResponse = useSettingsQuery();
  const [slug, setSlug] = useState(post.slug);
  const { updatePost, debounceUpdatePost } = useUpdatePost();
  const [saving, setSaving] = useState("");

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
    let formattedSlug = createPathWithPrefix(
      textToSlug(getLastPartFromPath(slug)),
      post.type,
    );
    setSlug(formattedSlug);
    updatePost({ id: post.id, slug: formattedSlug });
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
      <Dropdown
        placement="topLeft"
        overlay={
          <QuickMenu
            siteUrl={settings?.site_url ?? ""}
            postHash={postHash}
            showDrawer={showDrawer}
          />
        }
        trigger={["click"]}
      >
        <a
          data-testid="postMenuBtn"
          className="ant-dropdown-link"
          onClick={(e) => e.preventDefault()}
        >
          <MoreOutlined style={{ fontSize: 30 }} />
        </a>
      </Dropdown>
      <Drawer
        title="Settings"
        placement="right"
        closable={true}
        onClose={onClose}
        visible={visible}
        width={drawerWidth}
        zIndex={10000}
        extra={[saving || <span>────</span>]}
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
                updatePost({
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
            onChange={(e) =>
              debounceUpdatePost({ excerpt: e.target.value, id: post.id })
            }
            value={post.excerpt}
          />
        </div>
        <Divider />
        <div>
          <label>Path</label>
          <p className="help-text">
            The URL of your post. Should contain only letters, numbers, - and
            should start with /post/.
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
      <style jsx global>{`
        .ant-drawer-header {
          border-bottom: 1px solid rgb(var(--color-border));
        }
      `}</style>
    </>
  );
};

export default Actions;
