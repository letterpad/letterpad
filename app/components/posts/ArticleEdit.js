import React, { Component } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import Editor from "./Editor";
import PostActions from "./PostActions";
import FeaturedImage from "./FeaturedImage";

var ContentEditable = React.createClass({
    render: function() {
        return (
            <h2
                className="post-title"
                onInput={this.emitChange}
                onBlur={this.emitChange}
                contentEditable
                dangerouslySetInnerHTML={{
                    __html: this.props.title || "Draft.."
                }}
            />
        );
    },
    shouldComponentUpdate: function(nextProps) {
        return nextProps.title !== ReactDOM.findDOMNode(this).innerHTML;
    },
    emitChange: function() {
        var title = ReactDOM.findDOMNode(this).innerHTML;
        if (this.props.onChange && title !== this.lastTitle) {
            this.props.onChange({
                target: {
                    value: title
                }
            });
        }
        this.lastTitle = title;
    }
});

export default class EditArticle extends Component {
    render() {
        return (
            <div className="card">
                <article className="post">
                    <FeaturedImage post={this.props.post} />
                    <div className="post-header">
                        <ContentEditable
                            title={this.props.post.title}
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
                        <Editor body={this.props.post.body} />
                    </div>
                </article>
            </div>
        );
    }
}
