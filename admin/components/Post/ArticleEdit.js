import React, { Component } from "react";
import moment from "moment";
import Editor from "./Editor";
import PostActions from "./PostActions";
import FeaturedImage from "./FeaturedImage";
import ContentEditable from "./ContentEditable";
import PropTypes from "prop-types";

export default class ArticleEdit extends Component {
    render() {
        return (
            <div className="card">
                <article className="post">
                    <FeaturedImage post={this.props.post} />
                    <div className="post-header">
                        <ContentEditable
                            title={this.props.post.title}
                            placeholder="Enter a title"
                            onChange={e => {
                                PostActions.setData({
                                    title: e.target.value
                                });
                            }}
                        />
                        <div className="post-meta">
                            {moment(
                                new Date(this.props.post.created_at)
                            ).format("LL")}
                        </div>
                    </div>
                    <div className="post-content">
                        <Editor
                            mode={this.props.post.mode}
                            body={this.props.post.body}
                        />
                    </div>
                </article>
            </div>
        );
    }
}

ArticleEdit.propTypes = {
    post: PropTypes.object
};
