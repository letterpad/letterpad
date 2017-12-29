import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Loader from "../Loader";

export const Rows = props => {
    if (props.loading) {
        return (
            <tbody>
                <tr>
                    <td colSpan={props.colSpan}>
                        <Loader type="spin" />
                    </td>
                </tr>
            </tbody>
        );
    }
    let data = (
        <tr>
            <td colSpan={props.colSpan}>Nothing found..</td>
        </tr>
    );
    if (props.posts.rows.length > 0) {
        data = props.posts.rows.map((post, i) => {
            return <TableRow {...props} post={post} key={i} />;
        });
    }
    return <tbody>{data}</tbody>;
};
export class TableRow extends Component {
    constructor(props) {
        super(props);
    }
    postSelected(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        const post = this.props.post;
        const categories = post.taxonomies
            .filter(item => item.type == "post_category")
            .map(cat => cat.name)
            .join(", ");

        const tags = post.taxonomies
            .filter(item => item.type == "post_tag")
            .map(tag => tag.name)
            .join(", ");

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
                    onClick={() => this.props.handleClick(this.props.post.id)}
                >
                    {this.props.post.title || "Draft.."}
                </td>
                <td>{categories}</td>
                <td>{tags}</td>
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
