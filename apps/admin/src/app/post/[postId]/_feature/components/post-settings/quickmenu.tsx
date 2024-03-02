import { FC } from "react";
import { IoEyeOutline, IoSettingsOutline } from "react-icons/io5";
import { useTheme } from "ui";

import { Dropdown } from "@/components/dropdown/dropdown";

import { EventAction, track } from "@/track";

interface Props {
  siteUrl: string;
  postHash: string;
  showDrawer: () => void;
  showPreview?: boolean;
  id: number;
}
export const QuickMenu: FC<Props> = ({
  siteUrl,
  postHash,
  showDrawer,
  showPreview,
}) => {
  const { theme, setTheme } = useTheme();
  const openPreview = () => {
    track({
      eventAction: EventAction.Change,
      eventCategory: "setting",
      eventLabel: "preview",
    });
    window.open(siteUrl + "/preview/" + postHash);
  };
  return (
    <div className="flex items-center gap-6">
      <Dropdown
        testId="post-actions"
        label="Options"
        options={[
          {
            name: "Settings",
            onClick: showDrawer,
            testId: "postSettingsLink",
            icon: IoSettingsOutline,
          },
          {
            name: "Preview",
            onClick: openPreview,
            icon: IoEyeOutline,
            hidden: !showPreview,
          },
          {
            name: "Switch Theme",
            onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
            icon: IoEyeOutline,
          },
        ]}
      />
    </div>
  );
};
