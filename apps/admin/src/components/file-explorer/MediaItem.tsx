import { Media } from "letterpad-graphql";
import React from "react";

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

  const classes = isSelected ? "item selected" : "item";
  return (
    <div data-testid="media-item" className={classes} onClick={onSelect}>
      <img src={media.url} alt={media.name} />

      <style jsx>{`
        img {
          display: flex;
          width: 100%;
          object-fit: cover;
        }
        .item {
          align-items: center;
          display: flex;
          background: rgba(var(--color-border), 0.5);
          padding: 10px;
        }
        .item.selected {
          background: rgba(var(--accent), 0.5);
        }
        /* .item:nth-child(5n) {
          grid-column-end: span 2;
        } */
      `}</style>
    </div>
  );
};
export default MediaItem;
