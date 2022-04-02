import siteConfig from "@/config/site.config";
import { Drawer } from "antd";
import ProfileInfo from "../profile-info";
import Menu from "../menu";
import Logo from "../Logo";
import { Stats } from "@/__generated__/__types__";

interface Props {
  site_logo?: string;
  site_title: string;
  site_url: string;
  name: string;
  avatar?: string;
  isVisible: boolean;
  setIsVisible: (a: boolean) => void;
  stats: Stats | {};
}

export const DesktopMenu: React.VFC<Props> = ({
  site_logo,
  site_title,
  site_url,
  name,
  avatar,
  isVisible,
  setIsVisible,
  stats,
}) => {
  return (
    <Drawer
      mask={false}
      closeIcon={false}
      onClose={() => setIsVisible(false)}
      drawerStyle={{ background: "rgb(var(--sidebar-bg))" }}
      placement="left"
      bodyStyle={{ background: "rgb(var(--sidebar-bg))" }}
      contentWrapperStyle={{ boxShadow: "none" }}
      headerStyle={{
        padding: "0 24px",
        background: "none",
        borderColor: "#333",
      }}
      width={siteConfig.sidebar_width}
      visible={isVisible}
      title={
        site_logo ? (
          <Logo src={site_logo} padding="16px 0px" />
        ) : (
          <h2>{site_title}</h2>
        )
      }
      footer={<ProfileInfo name={name} avatar={avatar} site_url={site_url} />}
      footerStyle={{ borderColor: "#333" }}
    >
      <Menu stats={stats} />
    </Drawer>
  );
};
