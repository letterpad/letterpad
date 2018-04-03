import React, { Component } from "react";
import moment from "moment";
import { browserHistory } from "react-router";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import config from "../../../config";
import { makeUrl } from "../../../shared/util";

export default class MediaItem extends Component {
    constructor(props) {
        super(props);
        this.onMediaSelected = this.onMediaSelected.bind(this);
    }

    onMediaSelected() {
        this.props.onMediaSelected(this.props.media);
    }

    render() {
        const url = makeUrl(this.props.media.url.slice(1));
        const isSelected = this.props.selected_id === this.props.media.id;
        const classes = "post" + (isSelected ? " selected" : "");
        return (
            <div className="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                <article className={classes} onClick={this.onMediaSelected}>
                    <div className="post-thumbnail">
                        <img width="100" src={this.props.media.url} />
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

MediaItem.propTypes = {
    media: PropTypes.object
};
