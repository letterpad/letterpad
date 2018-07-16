import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ExcerptBox = styled.textarea`
    border: none;
    width: 100%;
`;
import PostActions from "./PostActions";

class ContentEditable extends Component {
    static propTypes = {
        excerpt: PropTypes.string,
        onChange: PropTypes.func
    };

    state = {
        excerpt: this.props.excerpt
    };

    emitChange = excerpt => {
        if (this.props.onChange) {
            this.setState({ excerpt });
            this.props.onChange({
                target: {
                    value: excerpt
                }
            });
        }
    };

    render() {
        return (
            <ExcerptBox
                className="post-excerpt"
                onChange={e => {
                    this.emitChange(e.target.value);
                }}
                maxLength={160}
                placeholder="Write a small description"
                value={this.props.excerpt}
            />
        );
    }
}

class Excerpt extends Component {
    static propTypes = {
        post: PropTypes.object
    };

    state = {
        chars: 0,
        excerpt: this.props.post.excerpt
    };

    componentDidMount() {
        let excerpt = this.state.excerpt;
        if (!excerpt) {
            // the body will contain html characters. Remove all the tags and get plain text
            let stripedHtml = this.props.post.body.replace(/<[^>]+>/g, "");
            const text = document.createElement("textarea");
            text.innerHTML = stripedHtml;
            const decodedHtml = text.value;
            // maximum number of characters to extract
            const maxLength = 150;
            if (decodedHtml.length > maxLength) {
                //trim the string to the maximum length
                let trimmedString = decodedHtml.substr(0, maxLength);
                //re-trim if we are in the middle of a word
                excerpt =
                    trimmedString.substr(
                        0,
                        Math.min(
                            trimmedString.length,
                            trimmedString.lastIndexOf(" ")
                        )
                    ) + "...";
            }
        }
        this.setData(excerpt);
    }

    setData = excerpt => {
        this.setState({ chars: excerpt.length, excerpt });
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
                    excerpt={this.state.excerpt}
                    onChange={e => this.setData(e.target.value)}
                />
                <small>{this.state.chars} / 160</small>
            </div>
        );
    }
}

export default Excerpt;
