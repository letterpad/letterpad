import { FC } from "react";
import { IoEyeOutline, IoSettingsOutline } from "react-icons/io5";

import { socket } from "@/components/post/components/tinymce/socket";
import { Buttonv2 } from "@/components_v2/button";

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
        <Buttonv2
          size="small"
          disabled={!socket.isAvailable}
          onClick={(e) => {
            if (!socket.isAvailable) return;
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
        </Buttonv2>
      )}
      {preview && (
        <a
          title="Preview"
          className="cursor-pointer"
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
        className="cursor-pointer"
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
