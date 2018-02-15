import React, { Component } from "react";
import PostActions from "./PostActions";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class ContentEditable extends Component {
    componentDidMount() {
        this.lastExcerpt = this.props.excerpt;
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.excerpt !== ReactDOM.findDOMNode(this).innerHTML;
    }

    emitChange() {
        var excerpt = ReactDOM.findDOMNode(this).innerHTML;
        if (this.props.onChange && excerpt !== this.lastExcerpt) {
            this.props.onChange({
                target: {
                    value: excerpt
                }
            });
        }
        this.lastExcerpt = excerpt;
    }

    render() {
        return (
            <span
                className="post-excerpt"
                onInput={this.emitChange}
                onBlur={this.emitChange}
                contentEditable
                placeholder="Write a small description"
                dangerouslySetInnerHTML={{
                    __html: this.props.excerpt
                }}
            />
        );
    }
}

ContentEditable.propTypes = {
    excerpt: PropTypes.string,
    onChange: PropTypes.func
};

class Excerpt extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        PostActions.setData({ excerpt: this.props.post.excerpt });
    }

    render() {
        return (
            <div className="card">
                <div className="x_title">
                    <div className="module-title">Excerpt</div>
                    <div className="clearfix" />
                </div>
                <div className="x_content">
                    <div className="control-group">
                        <ContentEditable
                            excerpt={this.props.post.excerpt}
                            onChange={e => {
                                PostActions.setData({
                                    excerpt: e.target.value
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
Excerpt.propTypes = {
    post: PropTypes.object
};

export default Excerpt;
