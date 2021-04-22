import Modal from "antd/lib/modal/Modal";
import { MediaProvider } from "../../pages/post/[postId]";
import Internal from "./providers/Internal";
import Unsplash from "./providers/Unsplash";
import {
  Image,
  Media,
} from "../../../__generated__/src/graphql/type-defs.graphqls";
import { Button } from "antd";
import MediaItem from "./MediaItem";
import { useState } from "react";

interface IProps {
  isVisible: boolean;
  handleCancel: () => void;
  mediaProvider: MediaProvider;
  switchProvider: (provider: MediaProvider) => void;
  multi: boolean;
}
const FileExplorer = ({
  isVisible,
  handleCancel,
  mediaProvider,
  switchProvider,
  multi,
}: IProps) => {
  const isUnsplash = mediaProvider === MediaProvider.Unsplash;
  const isInternal = mediaProvider === MediaProvider.Letterpad;

  const toggleProvider = isUnsplash
    ? MediaProvider.Letterpad
    : MediaProvider.Unsplash;

  const [selectedUrls, setSelection] = useState<{ [url: string]: Image }>({});

  // const onSelect = (images: { [url: string]: Image }) => {
  //   setSelection(images);
  // };

  const onMediaSelected = (media: Media) => {
    let urls = { ...selectedUrls };
    if (urls[`${media.url}`]) {
      delete urls[`${media.url}`];
    } else {
      urls[`${media.url}`] = {
        src: media.url,
        width: media.width || 0,
        height: media.height || 0,
      };
    }
    if (!multi) {
      urls[`${media.url}`] = {
        src: media.url,
        width: media.width || 0,
        height: media.height || 0,
      };
    }
    setSelection(urls);
    // onSelect(urls);
  };

  const renderer = (media: Media[]) => {
    return media.map(item => (
      <MediaItem
        key={item.id}
        media={item}
        isSelected={!!selectedUrls[item.url]}
        onMediaSelected={onMediaSelected}
      />
    ));
  };

  if (!isVisible) return null;
  return (
    <Modal
      title="Media"
      visible={isVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button type="primary" onClick={() => switchProvider(toggleProvider)}>
          {isUnsplash ? "My Media" : "Search Online"}
        </Button>,
      ]}
    >
      {isInternal && <Internal renderer={renderer} />}
      {isUnsplash && <Unsplash renderer={renderer} />}
    </Modal>
  );
};

export default FileExplorer;
