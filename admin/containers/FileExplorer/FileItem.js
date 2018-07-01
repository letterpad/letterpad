import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";

import config from "config";

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
            <div className="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                <article className={classes} onClick={this.onMediaSelected}>
                    <div className="post-thumbnail">
                        <img
                            width="100"
                            src={config.baseName + this.props.media.url}
                        />
                    </div>
                    <div className="post-body with-border">
                        <div className="post-header">
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
                </article>
            </div>
        );
    }
}
