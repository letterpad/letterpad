import React, { useState, useEffect } from "react";
import { Row, Col, Tooltip, Input, Drawer, Button, Space, Switch } from "antd";
import {
  CheckCircleOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ImageUpload from "../ImageUpload";
import { PostStatusOptions, PostTypes } from "@/__generated__/__types__";
import Tags from "./tags";
import { useSettingsQuery } from "@/graphql/queries/queries.graphql";
import { getPostHash } from "./api";
import { PostContextType } from "../post/types";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/partial.graphql";
import { useSavingIndicator } from "@/hooks/useSavingIndicator";
import { socket } from "../post/components/tinymce/socket";

const { TextArea } = Input;

interface IProps {
  post: PostWithAuthorAndTagsFragment;
  setPostAttribute: PostContextType["setPostAttribute"];
  deletePost: () => void;
}
const Actions = ({ post, setPostAttribute, deletePost }: IProps) => {
  if (post && post.__typename !== "Post") return null;

  const SavingIndicator = useSavingIndicator();

  const [visible, setVisible] = useState(false);
  const [postHash, setPostHash] = useState("");
  const settings = useSettingsQuery();

  useEffect(() => {
    getPostHash(post.id).then(setPostHash);
  }, [post.id]);

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  if (post.__typename !== "Post") return null;

  const isPublished = post.status === PostStatusOptions.Published;
  const isPost = post.type === PostTypes.Post;
  const postVerb = isPost ? "Post" : "Page";
  const rePublishBtnDisabled =
    post.html_draft === "" || post.html_draft == post.html;

  return (
    <>
      <Tooltip title="Preview">
        <Button
          type="ghost"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            if (settings.data?.settings.__typename === "Setting") {
              window.open(
                settings.data.settings.site_url + "/preview/" + postHash,
              );
            }
          }}
        />
      </Tooltip>
      <Tooltip title="Grammar">
        <Button
          type="ghost"
          shape="circle"
          size="small"
          icon={<CheckCircleOutlined />}
          onClick={() => {
            socket.checkGrammar();
          }}
        />
      </Tooltip>
      <Button
        size="small"
        type="primary"
        disabled={rePublishBtnDisabled}
        onClick={() => {
          setPostAttribute({
            status: PostStatusOptions.Published,
          });
        }}
      >
        Republish
      </Button>
      <Button type="primary" onClick={showDrawer} size="small">
        <SettingOutlined />
      </Button>
      <Drawer
        title="Settings"
        placement="right"
        closable={true}
        onClose={onClose}
        visible={visible}
        width={320}
        extra={[SavingIndicator]}
      >
        <Space direction="vertical" size="middle">
          <Row justify="space-between">
            <Col span={20}>Published</Col>
            <Col span={4}>
              <Switch
                size="small"
                checked={isPublished}
                onChange={(change) => {
                  setPostAttribute({
                    status: change
                      ? PostStatusOptions.Published
                      : PostStatusOptions.Draft,
                  });
                }}
              />
            </Col>
          </Row>
          <Row justify="space-between" hidden={!isPost}>
            <Col span={20}>Featured</Col>
            <Col span={4}>
              <Switch
                size="small"
                checked={post.featured}
                onChange={(change) => {
                  setPostAttribute({
                    featured: change,
                  });
                }}
              />
            </Col>
          </Row>
          <div>
            <label>{postVerb} Description</label>
            <TextArea
              showCount
              rows={3}
              maxLength={160}
              onChange={(e) => setPostAttribute({ excerpt: e.target.value })}
              value={post.excerpt}
            />
          </div>
          <div>
            <label>Path</label>
            <Input
              onChange={(e) => setPostAttribute({ slug: e.target.value })}
              value={post.slug}
            />
          </div>
          {isPost && <Tags post={post} setPostAttribute={setPostAttribute} />}
          <div>
            <label>Cover Image</label>
            <ImageUpload
              name="Cover Image"
              url={post.cover_image.src}
              onDone={([res]) => {
                setPostAttribute({
                  cover_image: {
                    src: res.src,
                    width: res.size.width,
                    height: res.size.height,
                  },
                });
              }}
            />
          </div>
          <Button type="primary" danger onClick={deletePost}>
            Delete {postVerb}
          </Button>
        </Space>
      </Drawer>
    </>
  );
};

export default Actions;
