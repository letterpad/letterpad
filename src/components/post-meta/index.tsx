import React, { useState } from "react";
import { Tooltip, Input, Drawer, Button, Checkbox, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import ImageUpload from "../ImageUpload";
import {
  InputUpdatePost,
  PostStatusOptions,
} from "../../../__generated__/src/graphql/type-defs.graphqls";
import Tags from "./tags";
import { PostQuery } from "../../../__generated__/src/graphql/queries/queries.graphql";

const { TextArea } = Input;

interface IProps {
  post: PostQuery["post"];
  setPostAttribute: (attrs: Omit<InputUpdatePost, "id">) => void;
}
const Actions = ({ post, setPostAttribute }: IProps) => {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  if (post.__typename !== "Post") return null;
  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer
        title="Settings"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={320}
      >
        <Space direction="vertical" size="middle">
          <Tooltip title="Preview">
            <Button type="ghost" shape="circle" icon={<EyeOutlined />} />
          </Tooltip>

          <Checkbox
            onChange={e =>
              setPostAttribute({
                status: e.target.checked
                  ? PostStatusOptions.Published
                  : PostStatusOptions.Draft,
              })
            }
            checked={post.status === PostStatusOptions.Published}
          >
            Unpublish this post
          </Checkbox>
          <Checkbox
            onChange={e => setPostAttribute({ featured: e.target.checked })}
            checked={post.featured}
          >
            Mark as featured post
          </Checkbox>
          <div>
            <label>Post Description</label>
            <TextArea
              showCount
              maxLength={160}
              onChange={e => setPostAttribute({ excerpt: e.target.value })}
              value={post.excerpt}
            />
          </div>
          <div>
            <label>Path</label>
            <Input
              onChange={e => setPostAttribute({ slug: e.target.value })}
              value={post.slug}
            />
          </div>
          <Tags post={post} setPostAttribute={setPostAttribute} />
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
          <Button type="primary" danger>
            Delete Post
          </Button>
        </Space>
      </Drawer>
    </>
  );
};

export default Actions;
