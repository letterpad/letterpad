import React, { useState } from "react";

import FileItem from "./FileItem";
import Internal from "./providers/Internal";
import { Media } from "../../../__generated__/gqlTypes";
import { MediaProvider } from "../article/Edit";
import Unsplash from "./providers/Unsplash";

interface IFileExpolorerProps {
  multi: boolean;
  onSelect: (urls: string[]) => void;
  mediaProvider: MediaProvider;
}

const FileExplorer: React.FC<IFileExpolorerProps> = ({
  onSelect,
  mediaProvider,
  multi,
}) => {
  const [selectedUrls, setSelection] = useState<{ [url: string]: boolean }>({});

  const onMediaSelected = (media: Media) => {
    let urls = { ...selectedUrls };
    if (urls[`${media.url}`]) {
      delete urls[`${media.url}`];
    } else {
      urls[`${media.url}`] = true;
    }
    if (!multi) {
      urls = { [`${media.url}`]: true };
    }
    setSelection(urls);
    onSelect(Object.keys(urls));
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
