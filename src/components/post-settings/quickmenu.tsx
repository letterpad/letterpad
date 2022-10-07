import { EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC } from "react";

import { socket } from "@/components/post/components/tinymce/socket";
import { Select } from "@/components_v2/select/select";

import { PageType } from "@/graphql/types";
import { EventAction, track } from "@/track";

interface Props {
  siteUrl: string;
  postHash: string;
  showDrawer: () => void;
  pageType: PageType;
  setPageType: (type: PageType) => void;
}
const QuickMenu: FC<Props> = ({
  siteUrl,
  postHash,
  showDrawer,
  pageType,
  setPageType,
}) => {
  return (
    <div className="flex space-x-3">
      <Button
        type="text"
        onClick={() => {
          track({
            eventAction: EventAction.Click,
            eventCategory: "post",
            eventLabel: "grammar",
          });
          socket.checkGrammar();
        }}
      >
        Grammar
      </Button>
      <Select
        id="layout-switch"
        selected={pageType}
        items={[
          { key: PageType.ZigZag, label: "ZigZag" },
          { key: PageType.Grid, label: "Grid" },
        ]}
        onChange={(key) => {
          setPageType(key as PageType);
        }}
      />
      <Button
        type="text"
        onClick={() => {
          track({
            eventAction: EventAction.Change,
            eventCategory: "setting",
            eventLabel: "preview",
          });
          window.open(siteUrl + "/preview/" + postHash);
        }}
        icon={<EyeOutlined />}
      ></Button>
      <Button
        type="text"
        onClick={showDrawer}
        data-testid="postSettingsLink"
        icon={<SettingOutlined />}
      ></Button>
    </div>
  );
};
export default QuickMenu;
