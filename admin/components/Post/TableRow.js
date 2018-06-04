import React, { Component } from "react";
import moment from "moment";
import Loader from "../Loader";

const PostRows = props => {
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
            const isSelected = props.selectedPosts.indexOf(post.id) >= 0;
            return (
                <TableRow
                    {...props}
                    post={post}
                    key={i}
                    isSelected={isSelected}
                />
            );
        });
    }
    return <tbody>{data}</tbody>;
};

class TableRow extends Component {
    constructor(props) {
        super(props);
        this.postSelected = this.postSelected.bind(this);
    }

    postSelected(e) {
        this.props.setSelection(this.props.post.id);
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

        const checked = {
            checked: this.props.isSelected
        };

        return (
            <tr>
                <td align="center" onClick={this.postSelected.bind(this)}>
                    <label className="control control--checkbox">
                        <input
                            type="checkbox"
                            {...checked}
                            onClick={this.postSelected}
                            value={post.id}
                        />
                        <div className="control__indicator" />
                    </label>
                </td>
                <td
                    style={{ cursor: "pointer" }}
                    onClick={() => this.props.handleClick(post.id)}
                >
                    {post.title || "Draft.."}
                </td>
                {post.type == "post" && (
                    <td className="hidden-xs">{categories}</td>
                )}
                {post.type == "post" && <td className="hidden-xs">{tags}</td>}
                <td>{post.status}</td>
                <td className="hidden-xs">
                    {post.author.fname} {post.author.lname}
                </td>
                <td>{moment(new Date(post.created_at)).format("MMM Do")}</td>
            </tr>
        );
    }
}

export default PostRows;
