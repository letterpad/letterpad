import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import config from "../../../config";
import { notify } from "react-notify-toast";

export default class MediaItem extends Component {
    static propTypes = {
        media: PropTypes.object,
        deleteMedia: PropTypes.func,
        confirmDelete: PropTypes.func,
        editMediaInfo: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.deleteMedia = this.deleteMedia.bind(this);
        this.mediaClicked = this.mediaClicked.bind(this);
        this.editInfo = this.editInfo.bind(this);
    }
    postSelected(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    deleteMedia(e) {
        e.preventDefault();
        this.props.confirmDelete(this.props.media);
    }
    editInfo(e) {
        e.preventDefault();
        this.props.editMediaInfo(this.props.media);
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
    mediaClicked() {
        const url = config.baseName + this.props.media.url;
        window.open(url);
    }

    render() {
        const url = config.baseName + this.props.media.url;
        return (
            <article className="post">
                <div className="post-thumbnail" onClick={this.editInfo}>
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
                        <div className="actions">
                            <Link to="#" onClick={this.deleteMedia}>
                                <i className="fa fa-trash media-icon" />
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        );
    }
}
