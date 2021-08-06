import Image from "next/image";
import {Col, Button, Popconfirm} from "antd";
import {Media} from "@/__generated__/__types__";

interface IProps {
  image: Media;
  setPreview: (img: Media) => void;
  deleteImage: (img: Media) => Promise<void>;
}

const MediaItem = ({image, setPreview, deleteImage}: IProps) => {
  return (
    <Col xs={12} sm={6} xl={4} key={image.id}>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setPreview(image);
        }}
      >
        <Image
          src={image.url}
          width={image.width || 100}
          height={image.height || 200}
          loading="lazy"
          layout="intrinsic"
        />
      </a>
      <Popconfirm
        title="Are you sure to delete this image?"
        onConfirm={() => deleteImage(image)}
        // onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button size="small" type="link" danger>
          Delete
        </Button>
      </Popconfirm>
    </Col>
  );
};

export default MediaItem;
