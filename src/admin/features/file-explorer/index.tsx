import { CoverImage, Media } from "../../../__generated__/gqlTypes";
import React, { useState } from "react";

import FileItem from "./FileItem";
import Internal from "./providers/Internal";
import { MediaProvider } from "../article/Edit";
import Unsplash from "./providers/Unsplash";

interface IFileExpolorerProps {
  multi: boolean;
  onSelect: (urls: { [url: string]: CoverImage }) => void;
  mediaProvider: MediaProvider;
}

const FileExplorer: React.FC<IFileExpolorerProps> = ({
  onSelect,
  mediaProvider,
  multi,
}) => {
  const [selectedUrls, setSelection] = useState<{ [url: string]: CoverImage }>(
    {},
  );

  const onMediaSelected = (media: Media) => {
    let urls = { ...selectedUrls };
    if (urls[`${media.url}`]) {
      delete urls[`${media.url}`];
    } else {
      urls[`${media.url}`] = {
        src: media.url,
        width: media.width,
        height: media.height,
      };
    }
    if (!multi) {
      urls = {
        [`${media.url}`]: {
          src: media.url,
          width: media.width,
          height: media.height,
        },
      };
    }
    setSelection(urls);
    onSelect(urls);
  };

  const renderer = (items: Media[]) => {
    return items.map(media => (
      <FileItem
        key={media.id}
        media={media}
        isSelected={selectedUrls[media.url]}
        onMediaSelected={onMediaSelected}
      />
    ));
  };

  switch (mediaProvider) {
    case MediaProvider.Letterpad: {
      return <Internal renderer={renderer} />;
    }

    case MediaProvider.Unsplash: {
      return <Unsplash renderer={renderer} />;
    }
  }
};

export default FileExplorer;
