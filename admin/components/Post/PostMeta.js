import React, { Component } from "react";
import PropTypes from "prop-types";
import PostActions from "./PostActions";
import moment from "moment";
import { makeUrl } from "../../../shared/util";

class PostMeta extends Component {
    constructor(props) {
        super(props);

        this.changeSlug = this.changeSlug.bind(this);
        this.state = {
            post: this.props.post,
            published: 0
        };
    }

    changeSlug(e) {
        this.setState({
            post: { ...this.state.post, slug: e.target.value }
        });
        PostActions.setData({ slug: this.state.post.slug });
    }

    render() {
        const permalink = makeUrl([this.state.post.type, this.state.post.slug]);
        return (
            <div className="card post-meta">
                <div className="x_content m-b-20">
                    <span className="meta-label">Published at</span>
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
                    <span className="meta-label">Link to post</span>
                    <div className="meta-value">
                        <a target="_blank" href={permalink}>
                            {permalink}
                        </a>
                    </div>
                </div>
                <div className="x_content m-b-20">
                    <span className="meta-label">Change Path</span>
                    <input
                        type="text"
                        className="form-control meta-value"
                        placeholder="Link to post"
                        defaultValue={this.state.post.slug}
                        onKeyUp={this.changeSlug}
                    />
                </div>
            </div>
        );
    }
}
PostMeta.propTypes = {
    post: PropTypes.object
};
export default PostMeta;
