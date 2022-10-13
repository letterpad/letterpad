import { EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC } from "react";

import { socket } from "@/components/post/components/tinymce/socket";

import { EventAction, track } from "@/track";

interface Props {
  siteUrl: string;
  postHash: string;
  showDrawer: () => void;
}
const QuickMenu: FC<Props> = ({ siteUrl, postHash, showDrawer }) => {
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
