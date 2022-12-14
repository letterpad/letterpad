import Image from "next/image";

import { Buttonv2 } from "@/components_v2/button";
import { Input } from "@/components_v2/input";
import { Modal } from "@/components_v2/modal";
import { TextArea } from "@/components_v2/textarea";

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
        <Buttonv2
          key="back"
          onClick={() => onChange(undefined)}
          variant="ghost"
        >
          Cancel
        </Buttonv2>,
        <Buttonv2
          key="submit"
          variant="primary"
          onClick={() => img && onUpdate(img)}
        >
          Save
        </Buttonv2>,
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
