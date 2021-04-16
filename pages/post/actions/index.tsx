import React, { useState } from "react";
import { Tooltip, Input, Drawer, Button, Checkbox, Tag, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import ImageUpload from "../ImageUpload";
import {
  Post,
  PostStatusOptions,
} from "../../../__generated__/lib/type-defs.graphqls";

const { TextArea } = Input;

type ValueOf<T> = T[keyof T];

interface IProps {
  post: Required<Post>;
  setPostAttribute: (key: keyof Post, value: ValueOf<Post>) => void;
}
const Actions = ({ post, setPostAttribute }: IProps) => {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const onChange = () => {};

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
            onChange={onChange}
            checked={post.status === PostStatusOptions.Published}
          >
            Unpublish this post
          </Checkbox>
          <Checkbox onChange={onChange} checked={post.featured}>
            Mark as featured post
          </Checkbox>
          <div>
            <label>Post Description</label>
            <TextArea
              showCount
              maxLength={160}
              onChange={onChange}
              value={post.excerpt}
            />
          </div>
          <div>
            <label>Path</label>
            <Input onChange={onChange} value={post.slug} />
          </div>
          <div>
            <label>Tags</label>
            {post.tags.map(tag => (
              <Tag
                key={tag.name}
                closable
                onClose={() => {
                  const tags = post.tags.filter(ele => ele.name !== tag.name);
                  setPostAttribute("tags", tags);
                }}
              >
                {tag.name}
              </Tag>
            ))}
          </div>
          <div>
            <label>Cover Image</label>
            <ImageUpload url={post.cover_image.src} />
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
