import React from "react";
import styled from "styled-components";
import { getReadableDate } from "../../../shared/utils";

import { Media } from "@/__generated__/type-defs.graphqls";

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

  const classes = isSelected ? " selected" : "";
  return (
    <Container data-testid="media-item" className={classes} onClick={onSelect}>
      <div className="post-thumbnail">
        <img src={media.url} />
      </div>
      <div className="post-body with-border">
        <div className="post-header hide">
          <div className="post-meta">
            {/* Placeholder for something cool. maybe*/}
          </div>
        </div>
        <div className="post-content">
          <div className="post-time">{getReadableDate(media.createdAt)}</div>
        </div>
      </div>
    </Container>
  );
};
export default MediaItem;

const Container = styled.article`
  .post-thumbnail {
    height: 150px;
    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }
  border: 2px solid transparent;
  &.selected {
    border: 2px solid var(--color-base);
  }
`;
