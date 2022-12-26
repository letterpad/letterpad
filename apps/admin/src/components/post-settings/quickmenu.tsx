import { FC } from "react";
import { IoEyeOutline, IoSettingsOutline } from "react-icons/io5";

import { Buttonv2 } from "@/components_v2/button";

import { EventAction, track } from "@/track";

import ThemeSwitcher from "../theme-switcher";

interface Props {
  siteUrl: string;
  postHash: string;
  showDrawer: () => void;
  preview?: boolean;
}
export const QuickMenu: FC<Props> = ({
  siteUrl,
  postHash,
  showDrawer,
  preview,
}) => {
  return (
    <div className="flex items-center gap-6">
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
      <ThemeSwitcher />
    </div>
  );
};
