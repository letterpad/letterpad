import Modal from "antd/lib/modal/Modal";
import { MediaProvider } from "../../pages/post/[postId]";
import Internal from "./providers/Internal";
import Unsplash from "./providers/Unsplash";
import { Image, Media } from "@/__generated__/__types__";
import { Button } from "antd";
import MediaItem from "./MediaItem";
import { useRef, useState } from "react";
import { uploadFile } from "shared/upload";

type ImageInput = {
  [urls: string]: Image & { alt: string };
};

interface IProps {
  isVisible: boolean;
  handleCancel: () => void;
  multi?: boolean;
  onInsert: (images: ImageInput) => Promise<unknown[]>;
  onImageFile?: (image: File[]) => Promise<string[]>;
}
const FileExplorer = ({
  isVisible,
  handleCancel,
  multi = true,
  onInsert,
}: IProps) => {
  const [mediaProvider, setMediaProvider] = useState<MediaProvider>(
    MediaProvider.Letterpad,
  );
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const isUnsplash = mediaProvider === MediaProvider.Unsplash;
  const isInternal = mediaProvider === MediaProvider.Letterpad;

  const toggleProvider = isUnsplash
    ? MediaProvider.Letterpad
    : MediaProvider.Unsplash;

  const [selectedUrls, setSelection] = useState<ImageInput>({});

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
    return media.map((item) => (
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
      centered
      width="60vw"
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
        isInternal ? (
          <Button
            key="upload"
            onClick={() => {
              hiddenInputRef.current?.click();
            }}
          >
            Browse
          </Button>
        ) : null,
        <Button
          type="primary"
          onClick={() => {
            setSelection({});
            setMediaProvider(toggleProvider);
          }}
        >
          {isUnsplash ? "My Media" : "Search Online"}
        </Button>,
      ]}
    >
      {isInternal && <Internal renderer={renderer} />}
      {isUnsplash && <Unsplash renderer={renderer} />}
      <input
        type="file"
        ref={hiddenInputRef}
        style={{ display: "none" }}
        onChange={async (e) => {
          if (!e.target.files) return;
          const [result] = await uploadFile({
            files: e.target.files,
            type: "cover_image",
          });
          let urls = { ...selectedUrls };
          urls[`${result.src}`] = { ...result, alt: "" };
          onInsert(urls);
        }}
      />
    </Modal>
  );
};

export default FileExplorer;
