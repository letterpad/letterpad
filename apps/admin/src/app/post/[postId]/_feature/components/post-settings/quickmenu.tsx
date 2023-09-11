import { FC, useState } from "react";
import { AiOutlineHistory } from "react-icons/ai";
import { IoEyeOutline, IoSettingsOutline } from "react-icons/io5";

import { Dropdown } from "@/components/dropdown/dropdown";
import ThemeSwitcher from "@/components/theme-switcher";

import { EventAction, track } from "@/track";

import { PostTimelineModal } from "../postTimelineModal";
import { useUpdatePost } from "../../api.client";
import { usePostVersioning } from "../../hooks";

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
  id,
}) => {
  const { updatePost } = useUpdatePost();
  const [showTimeline, setShowTimeline] = useState(false);
  const { versionManager } = usePostVersioning(id);
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
            name: "History",
            onClick: () => setShowTimeline(true),
            icon: AiOutlineHistory,
          },
          {
            name: "Switch Theme",
            onClick: ThemeSwitcher.toggle,
            icon: IoEyeOutline,
          },
        ]}
      />
      <PostTimelineModal
        onClose={() => setShowTimeline(false)}
        visible={showTimeline}
        onApply={(version) => {
          window["tinymce"].get("main-editor").setContent(version?.change);
          versionManager.updateBlog(version?.change ?? "");
          updatePost?.({
            html_draft: version?.change,
            id,
          });
        }}
      />
    </div>
  );
};
