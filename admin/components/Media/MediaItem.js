import React, { Component } from "react";
import moment from "moment";
import { browserHistory } from "react-router";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import config from "../../../config";

export default class MediaItem extends Component {
    constructor(props) {
        super(props);
        this.openMedia = this.openMedia.bind(this);
        this.deleteMedia = this.deleteMedia.bind(this);
    }
    postSelected(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    openMedia(e) {
        e.preventDefault();
        browserHistory.push("/admin/media/" + this.props.media.id);
    }
    deleteMedia(e) {
        e.preventDefault;
        this.props.confirmDelete(this.props.media);
    }

    render() {
        const url = config.rootUrl + this.props.media.url.slice(1);
        return (
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                <article className="post">
                    <div className="post-thumbnail">
                        <img width="100" src={this.props.media.url} />
                    </div>
                    <div className="post-body with-border">
                        <div className="post-header">
                            <div className="post-meta">
                                <Link to={url} target="_blank">
                                    {url}
                                </Link>
                            </div>
                        </div>
                        <div className="post-content">
                            <div className="post-time">
                                {moment(
                                    new Date(this.props.media.created_at)
                                ).fromNow()}
                            </div>
                            <Link to="#" onClick={this.deleteMedia}>
                                <i className="fa fa-trash" />
                            </Link>
                        </div>
                    </div>
                </article>
            </div>
        );
    }
}

MediaItem.propTypes = {
    media: PropTypes.object,
    deleteMedia: PropTypes.func
};
