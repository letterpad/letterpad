import {
  BarChartOutlined,
  ContainerOutlined,
  FileImageOutlined,
  FileTextOutlined,
  GlobalOutlined,
  LogoutOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

const menuItems = {
  "/posts": "1",
  "/pages": "2",
  "/media": "3",
  "/tags": "4",
  "/profile": "5",
  "/domain-mapping": "6",
  "/settings": "7",
  "/migrate": "8",
  "/logout": "9",
  "/subscribers": "10",
  "/dashboard": "11",
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
      style={{ paddingBottom: 60, background: "none" }}
    >
      <Menu.Item
        key={menuItems["/dashboard"]}
        icon={<BarChartOutlined />}
        onClick={() => router.push("/dashboard")}
      >
        Dashboard
      </Menu.Item>
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
        // isSelected={true}
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
        key={menuItems["/subscribers"]}
        icon={<TeamOutlined />}
        onClick={() => router.push("/subscribers")}
      >
        Subscribers
      </Menu.Item>
      <Menu.Item
        key={menuItems["/domain-mapping"]}
        icon={<GlobalOutlined />}
        onClick={() => router.push("/domain-mapping")}
      >
        Domain Mapping
      </Menu.Item>
      <Menu.Item
        key={menuItems["/settings"]}
        icon={<SettingOutlined />}
        onClick={() => router.push("/settings")}
      >
        Settings
      </Menu.Item>
      <Menu.Item
        key={menuItems["/migrate"]}
        icon={<UploadOutlined />}
        onClick={() => router.push("/migrate")}
        hidden={true}
      >
        Migrate
      </Menu.Item>
      <Menu.Item
        key={menuItems["/logout"]}
        icon={<LogoutOutlined />}
        onClick={() =>
          signOut({
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
