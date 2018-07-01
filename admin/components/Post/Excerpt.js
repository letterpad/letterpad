import React, { Component } from "react";
import PropTypes from "prop-types";

import PostActions from "./PostActions";

class ContentEditable extends Component {
    static propTypes = {
        excerpt: PropTypes.string,
        onChange: PropTypes.func
    };

    componentDidMount() {
        this.lastExcerpt = this.props.excerpt;
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.excerpt !== this.node.innerHTML;
    }

    emitChange = () => {
        const excerpt = this.node.innerHTML;
        if (this.props.onChange && excerpt !== this.lastExcerpt) {
            this.props.onChange({
                target: {
                    value: excerpt
                }
            });
        }
        this.lastExcerpt = excerpt;
    };

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
                ref={node => (this.node = node)}
            />
        );
    }
}

class Excerpt extends Component {
    static propTypes = {
        post: PropTypes.object
    };

    state = {
        chars: 0
    };

    componentDidMount() {
        this.setData(this.props.post.excerpt);
    }

    setData = excerpt => {
        this.setState({ chars: excerpt.length });
        PostActions.setData({
            excerpt
        });
    };

    render() {
        return (
            <div>
                <div className="meta-label">
                    Write a small introduction about this post
                </div>
                <ContentEditable
                    excerpt={this.props.post.excerpt}
                    onChange={e => this.setData(e.target.value)}
                />
                <p>{this.state.chars} / 160</p>
            </div>
        );
    }
}

export default Excerpt;
