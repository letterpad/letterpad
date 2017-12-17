import React, { Component } from "react";
import { Link } from "react-router";
import moment from "moment";
import { browserHistory } from "react-router";

export default class MediaItem extends Component {
    constructor(props) {
        super(props);
    }
    postSelected(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    openMedia() {
        browserHistory.push("/admin/media/" + this.props.media.id);
    }
    render() {
        return (
            <tr>
                <td align="center" onclick={this.postSelected.bind(this)}>
                    <label className="control control--checkbox">
                        <input
                            type="checkbox"
                            className="checkthis"
                            value={this.props.media.id}
                        />
                        <div className="control__indicator" />
                    </label>
                </td>
                <td
                    style={{ cursor: "pointer" }}
                    onClick={this.openMedia.bind(this)}
                >
                    <img className="media-image" src={this.props.media.url} />
                </td>
                <td>
                    {"http://" + window.location.host + this.props.media.url}
                </td>
                <td>
                    {moment(new Date(this.props.media.created_at)).format(
                        "MMM Do, YY"
                    )}
                </td>
                <td>
                    <button
                        style={{ padding: "6px" }}
                        className="btn-xs btn btn-dark"
                    >
                        <i className="fa fa-trash fa-2x" aria-hidden="true" />
                    </button>
                </td>
            </tr>
        );
    }
}
