import React, { Component } from "react";
import moment from "moment";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Editor from "./Editor";
import PostActions from "./PostActions";
import FeaturedImage from "./FeaturedImage";

class ContentEditable extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.title !== ReactDOM.findDOMNode(this).innerHTML;
    }
    emitChange() {
        const title = ReactDOM.findDOMNode(this).innerHTML;
        if (this.props.onChange && title !== this.lastTitle) {
            this.props.onChange({
                target: {
                    value: title
                }
            });
        }
        this.lastTitle = title;
    }
    render() {
        return (
            <h2
                className="post-title"
                onInput={this.emitChange}
                onBlur={this.emitChange}
                contentEditable
                placeholder={this.props.placeholder}
                dangerouslySetInnerHTML={{ __html: this.props.title }}
            />
        );
    }
}

ContentEditable.propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    title: PropTypes.string
};

export default class CreateArticle extends Component {
    render() {
        return (
            <div className="card">
                <article className="post">
                    <FeaturedImage post={this.props.post} />
                    <div className="post-header">
                        <ContentEditable
                            placeholder="Enter Title.."
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
