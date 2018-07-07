import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { makeUrl } from "../../../shared/util";
import PostActions from "./PostActions";

class PostMetaDrawer extends Component {
    state = {
        post: this.props.post
    };
    changeSlug = e => {
        this.setState({
            post: { ...this.state.post, slug: e.target.value }
        });
        PostActions.setData({ slug: this.state.post.slug });
    };
    static propTypes = {
        toggleMetaDrawer: PropTypes.func,
        post: PropTypes.object,
        isOpen: PropTypes.bool,
        updatePost: PropTypes.func.isRequired
    };

    render() {
        const permalink = makeUrl([this.state.post.type, this.state.post.slug]);
        return (
            <div className="post-meta">
                <div className="x_content m-b-20">
                    <div className="meta-label">Published at</div>
                    <input
                        type="text"
                        className="form-control meta-value"
                        placeholder="Published date"
                        defaultValue={moment(
                            new Date(this.state.post.created_at)
                        ).format("DD-MM-Y hh:mm A")}
                    />
                </div>
                <div className="x_content m-b-20">
                    <div className="meta-label">Change Path</div>
                    <input
                        type="text"
                        className="form-control meta-value"
                        placeholder="Link to post"
                        defaultValue={this.state.post.slug}
                        onKeyUp={this.changeSlug}
                    />
                </div>
                <div className="x_content m-b-20">
                    <div className="meta-label">Preview</div>
                    <div className="meta-value">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={permalink}
                        >
                            {permalink}
                        </a>
                    </div>
                </div>
                <hr />
                <div className="btn-item">
                    <button
                        type="submit"
                        onClick={e => this.props.updatePost(e, {})}
                        className={"publish-btn btn btn-sm btn-primary"}
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }
}

export default PostMetaDrawer;
