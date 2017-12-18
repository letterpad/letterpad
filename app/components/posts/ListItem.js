import React, { Component } from "react";
import { Link } from "react-router";
import moment from "moment";
import { browserHistory } from "react-router";

export default class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    postSelected(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    openArticle() {
        browserHistory.push(
            "/admin/" + this.props.post.type + "/" + this.props.post.id
        );
    }
    render() {
        return (
            <tr>
                <td align="center" onclick={this.postSelected.bind(this)}>
                    <label className="control control--checkbox">
                        <input
                            type="checkbox"
                            className="checkthis"
                            value={this.props.post.id}
                        />
                        <div className="control__indicator" />
                    </label>
                </td>
                <td
                    style={{ cursor: "pointer" }}
                    onClick={this.openArticle.bind(this)}
                >
                    {this.props.post.title || "Draft.."}
                </td>
                <td>{this.props.post.status}</td>
                <td>{this.props.post.author.username}</td>
                <td>
                    {moment(new Date(this.props.post.created_at)).format(
                        "MMM Do, YY"
                    )}
                </td>
            </tr>
        );
    }
}
