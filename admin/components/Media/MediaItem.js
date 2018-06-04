import React, { Component } from "react";
import moment from "moment";
import { browserHistory } from "react-router";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import config from "../../../config";
import { notify } from "react-notify-toast";

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
        e.preventDefault();
        this.props.confirmDelete(this.props.media);
    }
    copyToClipboard(e) {
        e.preventDefault();
        const textField = document.createElement("textarea");
        textField.innerText = e.target.href;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        textField.remove();
        notify.show("Link copied", "success");
    }
    render() {
        const url = config.baseName + this.props.media.url;
        return (
            <Link to={url} target="_blank">
                <article className="post">
                    <div className="post-thumbnail">
                        <img
                            width="100"
                            src={config.baseName + this.props.media.url}
                        />
                    </div>
                    <div className="post-body with-border">
                        <div className="post-content">
                            <div className="post-meta">
                                <Link to={url} onClick={this.copyToClipboard}>
                                    copy
                                </Link>
                            </div>
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
            </Link>
        );
    }
}

MediaItem.propTypes = {
    media: PropTypes.object,
    deleteMedia: PropTypes.func,
    confirmDelete: PropTypes.func
};
