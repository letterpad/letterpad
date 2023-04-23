import { basePath } from "next.config";
import { useCallback, useState } from "react";
import { FileExplorer } from "ui";

import { Media } from "@/__generated__/__types__";
import { uploadFile } from "@/shared/utils";

import MediaItem from "./MediaItem";
import InternalMedia from "./providers/Internal";
import Unsplash from "./providers/Unsplash";
import NoSsr from "../NoSsr";

import { MediaProvider, TypeMediaInsert } from "@/types";

interface IProps {
  isVisible: boolean;
  handleCancel: () => void;
  multi?: boolean;
  onInsert: (images: TypeMediaInsert[]) => void;
  onImageFile?: (image: File[]) => Promise<string[]>;
}
export const Container = ({
  isVisible,
  handleCancel,
  multi = false,
  onInsert,
}: IProps) => {
  const [mediaProvider, setMediaProvider] = useState<MediaProvider>(
    MediaProvider.Letterpad
  );

  const [selectedUrls, setSelection] = useState<{
    [urls: string]: TypeMediaInsert;
  }>({});

  const closeWindow = () => {
    setSelection({});
    handleCancel();
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

  if (!isVisible) return null;

  return (
    <NoSsr>
      <FileExplorer
        isVisible={isVisible}
        handleCancel={closeWindow}
        provider={mediaProvider}
        setProvider={setMediaProvider}
        onInsert={onInsert}
        uploadFile={uploadFile}
        multi={multi}
        renderProvider={(provider) => {
          return provider === MediaProvider.Letterpad ? (
            <InternalMedia renderer={renderer} />
          ) : (
            <Unsplash renderer={renderer} />
          );
        }}
        insertMedia={insertMedia}
        selectedUrls={selectedUrls}
        resetSelection={() => setSelection({})}
      />
      <style jsx global>{`
        .file-explorer {
          width: 90vw !important;
          margin: auto;
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
