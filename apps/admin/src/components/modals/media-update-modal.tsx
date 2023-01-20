import Image from "next/image";
import { Button, Input, Modal, TextArea } from "ui";

import { Media } from "@/__generated__/__types__";

const MediaUpdateModal = ({
  img,
  onChange,
  onUpdate,
}: {
  img?: Media;
  onChange: (change: Media | undefined) => void;
  onUpdate: (change: Media) => void;
}) => {
  if (!img) return null;
  return (
    <Modal
      header={img?.name}
      style={{ top: 20 }}
      show={!!img?.id}
      footer={[
        <Button key="back" onClick={() => onChange(undefined)} variant="ghost">
          Cancel
        </Button>,
        <Button
          key="submit"
          variant="primary"
          onClick={() => img && onUpdate(img)}
        >
          Save
        </Button>,
      ]}
      toggle={() => onChange(undefined)}
    >
      {img?.url && (
        <Image
          src={img.url}
          loading="lazy"
          width={img.width}
          height={img.height}
          alt={img.name}
        />
      )}
      <div className="flex flex-col gap-2">
        <Input
          label="Title of image"
          value={img?.name}
          onChange={(e) => {
            if (img) {
              onChange({ ...img, name: e.target.value });
            }
          }}
        />
        <TextArea
          label="Description of image"
          placeholder="Description of this image"
          value={img?.description}
          onChange={(e) => {
            if (img) {
              onChange({ ...img, description: e.target.value });
            }
          }}
        />
      </div>
    </Modal>
  );
};

export default MediaUpdateModal;
