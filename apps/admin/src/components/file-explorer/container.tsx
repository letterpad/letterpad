import { Media } from "letterpad-graphql";
import { useCallback, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { Button, DialogModal, SearchInput } from "ui";

import MediaItem from "./MediaItem";
import { Gallery } from "./providers/Gallery";
import { UploadZone } from "./providers/UploadZone";
import { useInternal } from "./providers/useInternal";
import { useUnsplash } from "./providers/useUnsplash";
import { basePath } from "../../constants";
import { EventAction, track } from "../../track";

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
    MediaProvider.Upload
  );
  const internal = useInternal();
  const unsplash = useUnsplash();

  const helper =
    mediaProvider === MediaProvider.Letterpad ? internal : unsplash;

  const [selectedUrls, setSelection] = useState<{
    [urls: string]: TypeMediaInsert;
  }>({});

  const closeWindow = () => {
    setSelection({});
    handleCancel();
  };

  const changeMediaProvider = (provider: MediaProvider) => {
    setSelection({});
    track({
      eventAction: EventAction.Click,
      eventCategory: "mediaProvider",
      eventLabel: provider,
    });
    setMediaProvider(provider);
  };

  useEffect(() => {
    setMediaProvider(MediaProvider.Upload);
  }, [isVisible]);

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
      setSelection(urls);
    },
    [selectedUrls]
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
  const selected = Object.keys(selectedUrls).length;
  return (
    <DialogModal
      type="state"
      open={isVisible}
      onOpenChange={closeWindow}
      title={
        <div className="flex justify-start items-center gap-2">
          Media Library{" "}
          {selected > 0 && (
            <div
              className="flex gap-2 items-center justify-center cursor-pointer"
              onClick={() => setSelection({})}
            >
              <span className="text-xs flex font-normal items-center gap-2 justify-between bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                {`${selected} selected`}

                <CgClose size={10} />
              </span>
            </div>
          )}
        </div>
      }
      contentClassName="lg:max-w-[60rem]"
      footer={
        <>
          <Button size="small" onClick={closeWindow} variant={"secondary"}>
            Cancel
          </Button>
          {mediaProvider !== MediaProvider.Upload && (
            <Button
              size="small"
              onClick={() => changeMediaProvider(MediaProvider.Upload)}
            >
              Upload File
            </Button>
          )}
          {!!selected && (
            <Button size="small" onClick={insertMedia}>
              Insert
            </Button>
          )}
        </>
      }
    >
      {mediaProvider === MediaProvider.Upload ? (
        <UploadZone
          onInsert={onInsert}
          selectedUrls={selectedUrls}
          showUnsplash={() => changeMediaProvider(MediaProvider.Unsplash)}
          showLocalMedia={() => changeMediaProvider(MediaProvider.Letterpad)}
        />
      ) : (
        <>
          {mediaProvider === MediaProvider.Unsplash && (
            <SearchInput
              value={unsplash.query}
              enterButton="Search"
              data-testid="input-unsplash"
              onSearch={unsplash.onSearchEnter}
              placeholder="Search high resolution photos from Unsplash"
              loading={unsplash.loading}
            />
          )}
          <Gallery
            loadMore={helper.loadMore}
            totalCount={helper.totalCount}
            jsxElements={renderer(helper.data)}
            key={mediaProvider}
          />
        </>
      )}
    </DialogModal>
  );
};
