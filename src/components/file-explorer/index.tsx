import Modal from "antd/lib/modal/Modal";
import { MediaProvider } from "../../pages/post/[postId]";
import Internal from "./providers/Internal";
import Unsplash from "./providers/Unsplash";
import { Image, Media } from "@/__generated__/type-defs.graphqls";
import { Button } from "antd";
import MediaItem from "./MediaItem";
import { useState } from "react";

interface IProps {
  isVisible: boolean;
  handleCancel: () => void;
  mediaProvider: MediaProvider;
  switchProvider: (provider: MediaProvider) => void;
  multi: boolean;
  onInsert: (images: {
    [urls: string]: Image & { alt: string };
  }) => Promise<unknown[]>;
}
const FileExplorer = ({
  isVisible,
  handleCancel,
  mediaProvider,
  switchProvider,
  multi,
  onInsert,
}: IProps) => {
  const isUnsplash = mediaProvider === MediaProvider.Unsplash;
  const isInternal = mediaProvider === MediaProvider.Letterpad;

  const toggleProvider = isUnsplash
    ? MediaProvider.Letterpad
    : MediaProvider.Unsplash;

  const [selectedUrls, setSelection] = useState<{
    [url: string]: Image & { alt: string };
  }>({});

  const closeWindow = () => {
    setSelection({});
    handleCancel();
  };

  const insertMedia = async () => {
    // get only the urls in an array
    try {
      await onInsert(selectedUrls);
    } catch (e) {
      // notify.show("Something unexpected happened.", "error");
    }
    setTimeout(closeWindow, 0);
  };

  const onMediaSelected = (media: Media) => {
    let urls = { ...selectedUrls };
    if (urls[`${media.url}`]) {
      delete urls[`${media.url}`];
    } else {
      urls[`${media.url}`] = {
        src: media.url,
        width: media.width || 0,
        height: media.height || 0,
        alt: media.description,
      };
    }
    if (!multi) {
      urls[`${media.url}`] = {
        src: media.url,
        width: media.width || 0,
        height: media.height || 0,
        alt: media.description,
      };
    }
    setSelection(urls);
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
  const hasSelectedImages = Object.keys(selectedUrls).length > 0;
  if (!isVisible) return null;
  return (
    <Modal
      title="Media"
      visible={isVisible}
      onCancel={closeWindow}
      footer={[
        <Button key="back" onClick={closeWindow}>
          Cancel
        </Button>,
        hasSelectedImages ? (
          <Button key="insert" onClick={insertMedia}>
            Insert
          </Button>
        ) : null,
        <Button
          type="primary"
          onClick={() => {
            setSelection({});
            switchProvider(toggleProvider);
          }}
        >
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
