import { FC, useState } from "react";
import { Button, Modal } from "ui";

import { Timeline } from "@/components/timeline";

import { parseDrafts } from "@/utils/utils";

import { useGetPost } from "../api.client";

import { PostHistoryItem } from "@/types";

interface Props {
  onClose: () => void;
  visible: boolean;
  onApply: (version: Version) => void;
}
interface Version {
  timestamp: string;
  change: string;
}

export const PostTimelineModal: FC<Props> = ({ onClose, visible, onApply }) => {
  const [tempTimelineData, setTempTimelineData] = useState<Version>();
  const res = useGetPost({ id: 3 });
  const data: PostHistoryItem[] = parseDrafts(res.data?.html_draft);

  return (
    <Modal
      header="Post Timeline"
      show={visible}
      size="lg"
      toggle={() => onClose()}
      footer={[
        <Button
          key="back"
          onClick={() => onClose()}
          variant="ghost"
          data-testid="cancelModalBtn"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          variant="primary"
          onClick={() => {
            onClose();
            if (tempTimelineData) {
              onApply(tempTimelineData);
            }
          }}
          disabled={false}
        >
          Apply
        </Button>,
      ]}
    >
      <h3 className="mb-8">
        Post time allows you to see your previous edits. This is useful in
        scribbling down ideas which you can refer later while writing the post.
      </h3>
      <div className="flex gap-4 px-16">
        <Timeline data={data} onTimelineChange={setTempTimelineData} />
      </div>
    </Modal>
  );
};
