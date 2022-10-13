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
  // UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { FC, useEffect, useMemo, useRef, useState } from "react";

const countStyle = {
  right: 24,
};

export const SiteMenu = ({ stats }) => {
  const router = useRouter();
  const { pathname } = router;
  const menuRef = useRef(null);

  const [key, setKey] = useState("");

  const handleClick = ({ key }) => {
    setKey(key);
  };

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  const menuItems = useMemo(() => {
    return [
      { key: "/dashboard", icon: <BarChartOutlined />, label: "Dashboard" },
      {
        key: "/posts",
        icon: <ContainerOutlined />,
        label: (
          <ItemLabelWithNumber label="Posts" value={stats?.posts?.published} />
        ),
      },
      {
        key: "/pages",
        icon: <FileTextOutlined />,
        label: (
          <ItemLabelWithNumber label="Pages" value={stats?.pages?.published} />
        ),
      },
      {
        key: "/media",
        icon: <FileImageOutlined />,
        label: <ItemLabelWithNumber label="Media" value={stats?.media} />,
      },

      {
        key: "/tags",
        icon: <TagsOutlined />,
        label: <ItemLabelWithNumber label="Tags" value={stats?.tags} />,
      },
      { key: "/profile", icon: <UserOutlined />, label: "Profile" },
      {
        key: "/domain-mapping",
        icon: <GlobalOutlined />,
        label: "Domain Mapping",
      },
      { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
      // { key: "/migrate", icon: <UploadOutlined />, label: "Migrate" },
      { key: "/subscribers", icon: <TeamOutlined />, label: "Subscribers" },
      {
        key: "/logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        onClick: () => {
          signOut({
            redirect: true,
          });
        },
      },
    ];
  }, [
    stats?.media,
    stats?.pages?.published,
    stats?.posts?.published,
    stats?.tags,
  ]);

  return (
    <Menu
      ref={menuRef}
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[router.pathname]}
      style={{ paddingBottom: 60, background: "none", flex: 1 }}
      items={menuItems}
      selectedKeys={[key]}
      onClick={(info) => {
        handleClick(info);
        if (info.key !== "/logout") router.push(info.key);
      }}
    />
  );
};

const ItemLabelWithNumber: FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => {
  return (
    <>
      <span>{label}</span>
      <span style={{ ...countStyle, position: "absolute" }}>{value}</span>
    </>
  );
};
