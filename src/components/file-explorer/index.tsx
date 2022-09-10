import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useCallback, useRef, useState } from "react";

import Internal from "@/components/file-explorer/providers/Internal";
import Unsplash from "@/components/file-explorer/providers/Unsplash";

import { Media } from "@/__generated__/__types__";
import { uploadFile } from "@/shared/utils";

import MediaItem from "./MediaItem";
import NoSsr from "../NoSsr";

import { MediaProvider, TypeMediaInsert } from "@/types";

interface IProps {
  isVisible: boolean;
  handleCancel: () => void;
  multi?: boolean;
  onInsert: (images: TypeMediaInsert[]) => void;
  onImageFile?: (image: File[]) => Promise<string[]>;
}
const FileExplorer = ({
  isVisible,
  handleCancel,
  multi = true,
  onInsert,
}: IProps) => {
  const [uploading, setUploading] = useState(false);
  const [mediaProvider, setMediaProvider] = useState<MediaProvider>(
    MediaProvider.Letterpad,
  );
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const isUnsplash = mediaProvider === MediaProvider.Unsplash;
  const isInternal = mediaProvider === MediaProvider.Letterpad;

  const toggleProvider = isUnsplash
    ? MediaProvider.Letterpad
    : MediaProvider.Unsplash;

  const [selectedUrls, setSelection] = useState<{
    [urls: string]: TypeMediaInsert;
  }>({});

  const closeWindow = () => {
    setSelection({});
    handleCancel();
  };

  const insertMedia = async () => {
    // get only the urls in an array
    try {
      await onInsert(Object.values(selectedUrls));
    } catch (e) {
      // notify.show("Something unexpected happened.", "error");
    }
    setTimeout(closeWindow, 0);
  };

  const onMediaSelected = useCallback(
    (media: Media) => {
      const urls = { ...selectedUrls };
      if (urls[`${media.url}`]) {
        delete urls[`${media.url}`];
      } else {
        urls[`${media.url}`] = {
          src: media.url,
          width: media.width || 0,
          height: media.height || 0,
          caption: media.description,
        };
      }
      if (!multi) {
        urls[`${media.url}`] = {
          src: media.url,
          width: media.width || 0,
          height: media.height || 0,
          caption: media.description,
        };
      }
      setSelection(urls);
    },
    [multi, selectedUrls],
  );

  const renderer = useCallback(
    (media: Media[]) => {
      return media.map((item) => (
        <MediaItem
          key={item.id}
          media={item}
          isSelected={!!selectedUrls[item.url]}
          onMediaSelected={onMediaSelected}
        />
      ));
    },
    [selectedUrls, onMediaSelected],
  );

  const hasSelectedImages = Object.keys(selectedUrls).length > 0;
  if (!isVisible) return null;
  return (
    <NoSsr>
      <Modal
        centered
        className="file-explorer"
        title={
          <>
            Media &nbsp;&nbsp;
            {uploading && (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 16, fontWeight: "bolder" }}
                    spin
                  />
                }
              />
            )}
          </>
        }
        visible={isVisible}
        onCancel={closeWindow}
        // width={window.innerWidth < 900 ? "90%" : "60%"}
        zIndex={1301} // 1300 is tinymce insert toolbar
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
            key="provider"
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
            const filesArr = Array.from(e.target.files);
            const fileSizeIncrease = filesArr.filter(
              (file) => file.size > 10000000,
            );
            if (fileSizeIncrease.length > 0) {
              alert("File size should be less than 10MB");
              return;
            }
            setUploading(true);
            const [result] = await uploadFile({
              files: e.target.files,
              type: "cover_image",
            });
            setUploading(false);
            const urls = { ...selectedUrls };
            urls[`${result.src}`] = { ...result, caption: "" };
            onInsert(Object.values(urls));
          }}
        />
      </Modal>
      <style jsx global>{`
        .file-explorer {
          width: 90vw !important;
        }
        @media (min-width: 991px) {
          .file-explorer {
            width: 60vw !important;
          }
        }
      `}</style>
    </NoSsr>
  );
};

export default FileExplorer;
