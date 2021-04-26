import { Menu } from "antd/";

import {
  ContainerOutlined,
  FileImageOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useRouter } from "next/router";
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

const countStyle = {
  right: 24,
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
        icon={<ContainerOutlined />}
        onClick={() => router.push("/posts")}
      >
        <span>Posts</span>
        <span style={{ ...countStyle, position: "absolute" }}>
          {stats?.posts?.published}
        </span>
      </Menu.Item>
      <Menu.Item
        key={menuItems["/pages"]}
        icon={<FileTextOutlined />}
        onClick={() => router.push("/pages")}
        isSelected={true}
      >
        <span>Pages</span>
        <span style={{ ...countStyle, position: "absolute" }}>
          {stats?.pages?.published}
        </span>
      </Menu.Item>
      <Menu.Item
        key={menuItems["/media"]}
        icon={<FileImageOutlined />}
        onClick={() => router.push("/media")}
      >
        <span>Media</span>
        <span style={{ ...countStyle, position: "absolute" }}>
          {stats?.media}
        </span>
      </Menu.Item>
      <Menu.Item
        key={menuItems["/tags"]}
        icon={<TagsOutlined />}
        onClick={() => router.push("/tags")}
      >
        <span>Tags</span>
        <span style={{ ...countStyle, position: "absolute" }}>
          {stats?.tags}
        </span>
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
        icon={<SettingOutlined />}
        onClick={() => router.push("/settings")}
      >
        Settings
      </Menu.Item>
      <Menu.Item
        key={menuItems["/logout"]}
        icon={<LogoutOutlined />}
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
