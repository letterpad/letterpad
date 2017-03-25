import React, { Component } from "react";
import { Link } from "react-router";
import moment from "moment";

export default class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <tr>
                <td align="center">
                    <input
                        type="checkbox"
                        className="checkthis"
                        value={this.props.post.id}
                    />
                </td>
                <td className="hidden-xs">1</td>
                <td>
                    <Link to={"/admin/post/" + this.props.post.id}>
                        {this.props.post.title}
                    </Link>
                </td>
                <td>{this.props.post.status}</td>
                <td>{this.props.post.author.username}</td>
                <td className="text-center">
                    {moment(new Date(this.props.post.created_at)).format(
                        "YYYY-MM-DD HH:mm:ss"
                    )}
                </td>
            </tr>
        );
    }
}
