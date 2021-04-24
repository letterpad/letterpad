import { Menu } from "antd/";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import { useRouter } from "next/router";
import styled from "styled-components";
import { signout } from "next-auth/client";

const menuItems = {
  "/posts": "1",
  "/pages": "2",
  "/media": "3",
  "/tags": "4",
  "/profile": "5",
  "/settings": "6",
  "/logout": "7",
};

const Navigation = ({ stats }) => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[menuItems[pathname]]}
    >
      <Menu.Item
        key={menuItems["/posts"]}
        icon={<UserOutlined />}
        onClick={() => router.push("/posts")}
      >
        <SpaceBetween>
          <span>Posts</span>
          <span className="count">{stats?.posts?.published}</span>
        </SpaceBetween>
      </Menu.Item>
      <Menu.Item
        key={menuItems["/pages"]}
        icon={<VideoCameraOutlined />}
        onClick={() => router.push("/pages")}
        isSelected={true}
      >
        <SpaceBetween>
          <span>Pages</span>
          <span className="count">{stats?.pages?.published}</span>
        </SpaceBetween>
      </Menu.Item>
      <Menu.Item
        key={menuItems["/media"]}
        icon={<UploadOutlined />}
        onClick={() => router.push("/media")}
      >
        <SpaceBetween>
          <span>Media</span>
          <span className="count">{stats?.media}</span>
        </SpaceBetween>
      </Menu.Item>
      <Menu.Item
        key={menuItems["/tags"]}
        icon={<UserOutlined />}
        onClick={() => router.push("/tags")}
      >
        <SpaceBetween>
          <span>Tags</span>
          <span className="count">{stats?.tags}</span>
        </SpaceBetween>
      </Menu.Item>
      <Menu.Item
        key={menuItems["/profile"]}
        icon={<UserOutlined />}
        onClick={() => router.push("/profile")}
      >
        Profile
      </Menu.Item>
      <Menu.Item
        key={menuItems["/settings"]}
        icon={<UserOutlined />}
        onClick={() => router.push("/settings")}
      >
        Settings
      </Menu.Item>
      <Menu.Item
        key={menuItems["/logout"]}
        icon={<UserOutlined />}
        onClick={() =>
          signout({
            redirect: true,
          })
        }
      >
        Logout
      </Menu.Item>
    </Menu>
  );
};

export default Navigation;

const SpaceBetween = styled.span`
  span.count {
    right: 24px !important;
    position: absolute !important;
  }
`;
