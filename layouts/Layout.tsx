import { useRouter } from "next/router";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Layout, { Footer, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";

const menuItems = {
  "/posts": "1",
  "/pages": "2",
  "/media": "3",
  "/tags": "4",
  "/profile": "5",
  "/settings": "6",
};

const CustomLayout = ({ children }) => {
  const router = useRouter();

  const { pathname } = router;

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
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
            Posts
          </Menu.Item>
          <Menu.Item
            key={menuItems["/pages"]}
            icon={<VideoCameraOutlined />}
            onClick={() => router.push("/pages")}
            isSelected={true}
          >
            Pages
          </Menu.Item>
          <Menu.Item
            key={menuItems["/media"]}
            icon={<UploadOutlined />}
            onClick={() => router.push("/media")}
          >
            Media
          </Menu.Item>
          <Menu.Item key={menuItems["/tags"]} icon={<UserOutlined />}>
            Tags
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
        </Menu>
      </Sider>
      <Layout>
        <Header
          className="site-layout-sub-header-background"
          style={{ padding: 0 }}
        />
        {children}
        <Footer style={{ textAlign: "center" }}>Letterpad</Footer>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
