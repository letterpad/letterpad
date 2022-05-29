import { Input } from "antd";
import Modal from "antd/lib/modal/Modal";
import Image from "next/image";

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
      title={img?.name}
      style={{ top: 20 }}
      visible={!!img?.id}
      onOk={() => img && onUpdate(img)}
      onCancel={() => onChange(undefined)}
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
      <Input
        value={img?.name}
        onChange={(e) => {
          if (img) {
            onChange({ ...img, name: e.target.value });
          }
        }}
      />
      <Input.TextArea
        placeholder="Description of this image"
        value={img?.description}
        onChange={(e) => {
          if (img) {
            onChange({ ...img, description: e.target.value });
          }
        }}
      />
    </Modal>
  );
};

export default MediaUpdateModal;
