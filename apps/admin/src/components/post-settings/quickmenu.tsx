import { EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC } from "react";

import { socket } from "@/components/post/components/tinymce/socket";

import { PageType } from "@/graphql/types";
import { EventAction, track } from "@/track";

interface Props {
  siteUrl: string;
  postHash: string;
  showDrawer: () => void;
  grammar?: boolean;
  preview?: boolean;
}
const QuickMenu: FC<Props> = ({
  siteUrl,
  postHash,
  showDrawer,
  grammar,
  preview,
}) => {
  return (
    <div className="flex space-x-3">
      {grammar && (
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
      )}
      {preview && (
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
      )}
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
