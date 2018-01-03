import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import Editor from "./Editor";
import PostActions from "./PostActions";
import FeaturedImage from "./FeaturedImage";
import ContentEditable from "./ContentEditable";

export default class CreateArticle extends Component {
    render() {
        return (
            <div className="card">
                <article className="post">
                    <FeaturedImage post={this.props.post} />
                    <div className="post-header">
                        <ContentEditable
                            placeholder="Enter a title"
                            title={this.props.title}
                            onChange={e => {
                                PostActions.setData({
                                    title: e.target.value
                                });
                            }}
                        />
                        <div className="post-meta">
                            {moment(new Date()).format("LL")}
                        </div>
                    </div>
                    <div className="post-content">
                        <Editor body="" />
                    </div>
                </article>
            </div>
        );
    }
}

CreateArticle.propTypes = {
    title: PropTypes.string,
    post: PropTypes.object
};
