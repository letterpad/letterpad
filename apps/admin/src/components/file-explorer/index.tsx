import { basePath } from "next.config";
import { useCallback, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Internal from "@/components/file-explorer/providers/Internal";
import Unsplash from "@/components/file-explorer/providers/Unsplash";
import { Buttonv2 } from "@/components_v2/button";
import { Modal } from "@/components_v2/modal";

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
    MediaProvider.Letterpad
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
      onInsert(Object.values(selectedUrls));
      Object.values(selectedUrls).forEach((media) => {
        if (!media.download_location) return;
        const url =
          basePath +
          "/api/unsplash?downloadLocation=" +
          media.download_location;

        fetch(url);
      });
    } catch (e: any) {
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
          //@ts-ignore
          download_location: media.download_location,
        };
      }
      if (!multi) {
        urls[`${media.url}`] = {
          src: media.url,
          width: media.width || 0,
          height: media.height || 0,
          caption: media.description,
          //@ts-ignore
          download_location: media.download_location,
        };
      }
      setSelection(urls);
    },
    [multi, selectedUrls]
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
    [selectedUrls, onMediaSelected]
  );

  const hasSelectedImages = Object.keys(selectedUrls).length > 0;
  if (!isVisible) return null;
  return (
    <NoSsr>
      <Modal
        className="file-explorer"
        header={
          <div className="flex items-center gap-4">
            Media
            {uploading && (
              <AiOutlineLoading3Quarters className="animate-spin" size={14} />
            )}
          </div>
        }
        show={isVisible}
        toggle={closeWindow}
        zIndex={1301} // 1300 is tinymce insert toolbar
        footer={[
          <Buttonv2 key="back" onClick={closeWindow} variant="ghost">
            Cancel
          </Buttonv2>,
          hasSelectedImages ? (
            <Buttonv2 key="insert" onClick={insertMedia}>
              Insert
            </Buttonv2>
          ) : null,
          isInternal ? (
            <Buttonv2
              key="upload"
              onClick={() => {
                hiddenInputRef.current?.click();
              }}
            >
              Browse
            </Buttonv2>
          ) : null,
          <Buttonv2
            key="provider"
            onClick={() => {
              setSelection({});
              setMediaProvider(toggleProvider);
            }}
          >
            {isUnsplash ? "My Media" : "Search Online"}
          </Buttonv2>,
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
              (file) => file.size > 10000000
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
            const {
              src,
              size: { width, height },
            } = result;
            urls[`${result.src}`] = { src, width, height, caption: "" };
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
