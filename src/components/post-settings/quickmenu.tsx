import { EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { socket } from "@/components/post/components/tinymce/socket";

import { EventAction, track } from "@/track";

const QuickMenu = ({ siteUrl, postHash, showDrawer }) => {
  return (
    <>
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
    </>
  );
};
export default QuickMenu;
