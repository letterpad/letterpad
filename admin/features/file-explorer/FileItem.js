import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import styled from "styled-components";
import config from "config";

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

export default class MediaItem extends Component {
    static propTypes = {
        media: PropTypes.object,
        onMediaSelected: PropTypes.func.isRequired,
        selected_id: PropTypes.number.isRequired
    };

    onMediaSelected = () => {
        this.props.onMediaSelected(this.props.media);
    };

    render() {
        const isSelected = this.props.selected_id === this.props.media.id;
        const classes = isSelected ? " selected" : "";
        return (
            <StyledItem className={classes} onClick={this.onMediaSelected}>
                <div className="post-thumbnail">
                    <img src={config.baseName + this.props.media.url} />
                </div>
                <div className="post-body with-border">
                    <div className="post-header hide">
                        <div className="post-meta">
                            {/* Placeholder for something cool. maybe*/}
                        </div>
                    </div>
                    <div className="post-content">
                        <div className="post-time">
                            {moment(
                                new Date(this.props.media.created_at)
                            ).fromNow()}
                        </div>
                    </div>
                </div>
            </StyledItem>
        );
    }
}
