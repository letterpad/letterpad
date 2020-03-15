import React, { Component } from "react";

import PropTypes from "prop-types";
import { getReadableDate } from "../../../shared/date";
import styled from "styled-components";

const StyledItem = styled.article`
  .post-thumbnail {
    height: 150px;
    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }
`;

export default class MediaItem extends Component<any, any> {
  static propTypes = {
    media: PropTypes.object,
    onMediaSelected: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
  };

  onMediaSelected = () => {
    this.props.onMediaSelected(this.props.media);
  };

  render() {
    const { isSelected } = this.props;
    const classes = isSelected ? " selected" : "";
    return (
      <StyledItem className={classes} onClick={this.onMediaSelected}>
        <div className="post-thumbnail">
          <img src={this.props.media.url} />
        </div>
        <div className="post-body with-border">
          <div className="post-header hide">
            <div className="post-meta">
              {/* Placeholder for something cool. maybe*/}
            </div>
          </div>
          <div className="post-content">
            <div className="post-time">
              {getReadableDate(this.props.media.createdAt)}
            </div>
          </div>
        </div>
      </StyledItem>
    );
  }
}
