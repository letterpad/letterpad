import React, { useState, useEffect } from "react";
import { Row, Col, Input, Drawer, Button, Switch } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import ImageUpload from "../ImageUpload";
import { PostStatusOptions, PostTypes } from "@/__generated__/__types__";
import Tags from "./tags";
import { useSettingsQuery } from "@/graphql/queries/queries.graphql";
import { getPostHash } from "./api";
import { PostContextType } from "../post/types";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/partial.graphql";
import { useSavingIndicator } from "@/hooks/useSavingIndicator";
import { socket } from "../post/components/tinymce/socket";
import { Menu, Dropdown } from "antd";
import { EventAction, track } from "@/track";

const { TextArea } = Input;

interface IProps {
  post: PostWithAuthorAndTagsFragment;
  setPostAttribute: PostContextType["setPostAttribute"];
  deletePost: () => void;
}

const Actions = ({ post, setPostAttribute, deletePost }: IProps) => {
  const SavingIndicator = useSavingIndicator();
  const [visible, setVisible] = useState(false);
  const [postHash, setPostHash] = useState("");
  const settings = useSettingsQuery();
  const [slug, setSlug] = useState(post.slug);

  useEffect(() => {
    getPostHash(post.id).then(setPostHash);
  }, [post.id]);

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  const formatSlug = (slug: string) => {
    let formattedSlug = slug.replace(/ /g, "-").toLocaleLowerCase();
    if (!formattedSlug.startsWith(`/${post.type}/`)) {
      formattedSlug = `/${post.type}/${formattedSlug}`;
    }
    setSlug(formattedSlug);
    setPostAttribute({ slug: formattedSlug });
  };

  if (post.__typename !== "Post") return null;

  const isPublished = post.status === PostStatusOptions.Published;
  const isPost = post.type === PostTypes.Post;
  const postVerb = isPost ? "Post" : "Page";
  const rePublishBtnDisabled =
    post.html_draft === "" || post.html_draft == post.html;

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={showDrawer}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="1"
        disabled={rePublishBtnDisabled}
        onClick={() => {
          setPostAttribute({
            status: PostStatusOptions.Published,
          });
        }}
      >
        Republish
      </Menu.Item>
      <Menu.Divider />
      {settings.data?.settings.__typename === "Setting" && (
        <Menu.Item
          key="2"
          onClick={() => {
            if (settings.data?.settings.__typename === "Setting") {
              track({
                eventAction: EventAction.Change,
                eventCategory: "setting",
                eventLabel: "preview",
              });
              window.open(
                settings.data.settings.site_url + "/preview/" + postHash,
              );
            }
          }}
        >
          Preview
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item
        key="3"
        onClick={() => {
          track({
            eventAction: EventAction.Click,
            eventCategory: "post",
            eventLabel: "grammar",
          });
          socket.checkGrammar();
        }}
      >
        Check Grammar
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["hover"]}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <MoreOutlined style={{ fontSize: 30 }} />
        </a>
      </Dropdown>

      <Drawer
        title="Settings"
        placement="right"
        closable={true}
        onClose={onClose}
        visible={visible}
        width={320}
        extra={[SavingIndicator]}
      >
        {/* <Space direction="vertical" size="middle"> */}
        <Row justify="space-between" gutter={16}>
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
        <br />
        <Row justify="space-between" hidden={!isPost} gutter={16}>
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
        {isPost && <br />}
        <div>
          <label>{postVerb} Description</label>
          <TextArea
            showCount
            rows={6}
            maxLength={160}
            onChange={(e) => setPostAttribute({ excerpt: e.target.value })}
            value={post.excerpt}
          />
        </div>
        <br />
        <div>
          <label>Path</label>
          <Input.Search
            onChange={(e) => setSlug(e.target.value)}
            // onChange={(e) => setPostAttribute({ slug: e.target.value })}
            value={slug}
            enterButton="Format"
            onSearch={formatSlug}
          />
        </div>
        <br />
        {isPost && <Tags post={post} setPostAttribute={setPostAttribute} />}
        {isPost && <br />}
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
        {/* </Space> */}
      </Drawer>
    </>
  );
};

export default Actions;
