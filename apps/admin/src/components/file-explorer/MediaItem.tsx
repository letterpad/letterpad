import classNames from "classnames";
import { Media } from "letterpad-graphql";
import React from "react";
import { TiTick } from "react-icons/ti";

interface IProps {
  media: Media;
  onMediaSelected: (media: Media) => void;
  isSelected?: boolean;
}

const MediaItem: React.FC<IProps> = ({
  media,
  onMediaSelected,
  isSelected,
}) => {
  const onSelect = () => {
    onMediaSelected(media);
  };

  return (
    <div
      data-testid="media-item"
      className={classNames("item flex items-center relative")}
      onClick={onSelect}
    >
      <img
        className={classNames("flex object-cover w-full rounded h-full", {
          "brightness-50": isSelected,
        })}
        src={media.url}
        alt={media.name}
        loading="lazy"
      />
      {isSelected && (
        <div className="absolute top-1/2 left-1/2 text-white -translate-x-1/2 -translate-y-1/2">
          <TiTick size={24} />
        </div>
      )}
    </div>
  );
};
export default MediaItem;
