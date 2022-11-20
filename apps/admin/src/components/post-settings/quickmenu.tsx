import { Button } from "antd";
import { FC } from "react";
import { IoEyeOutline, IoSettingsOutline } from "react-icons/io5";

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
    <div className="flex items-center gap-6">
      {grammar && (
        <a
          title="Check Grammar"
          onClick={(e) => {
            e.preventDefault();
            track({
              eventAction: EventAction.Click,
              eventCategory: "post",
              eventLabel: "grammar",
            });
            socket.checkGrammar();
          }}
        >
          Grammar
        </a>
      )}
      {preview && (
        <a
          title="Preview"
          onClick={(e) => {
            e.preventDefault();
            track({
              eventAction: EventAction.Change,
              eventCategory: "setting",
              eventLabel: "preview",
            });
            window.open(siteUrl + "/preview/" + postHash);
          }}
        >
          <IoEyeOutline size={18} />
        </a>
      )}
      <a
        title="Settings"
        onClick={(e) => {
          e.preventDefault();
          showDrawer();
        }}
        data-testid="postSettingsLink"
      >
        <IoSettingsOutline size={18} />
      </a>
    </div>
  );
};
export default QuickMenu;
