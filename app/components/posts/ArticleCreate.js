import React, { Component } from "react";
import { Link } from "react-router";
import moment from "moment";
import Editor from "./Editor";
import Tags from "./Tags";
import Categories from "./Categories";
import PostActions from "./PostActions";
import FeaturedImage from "./FeaturedImage";
import ReactDOM from "react-dom";

var ContentEditable = React.createClass({
    render: function() {
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

export default class CreateArticle extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
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
                <div className="font-serif">
                    <Tags post={this.props.post} />
                    <Categories post={this.props.post} />
                </div>
            </article>
        );
    }
}
