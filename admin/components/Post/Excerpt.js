import React, { Component } from "react";
import PostActions from "./PostActions";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class ContentEditable extends Component {
    constructor(props) {
        super(props);
        this.emitChange = this.emitChange.bind(this);
    }
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
        this.setData = this.setData.bind(this);

        this.state = {
            chars: 0
        };
    }

    componentDidMount() {
        this.setData(this.props.post.excerpt);
    }

    setData(excerpt) {
        this.setState({ chars: excerpt.length });
        PostActions.setData({
            excerpt
        });
    }

    render() {
        return (
            <div className="card">
                <div className="x_title">
                    <div className="module-title">Introduction</div>
                </div>
                <div className="x_content">
                    <div className="control-group">
                        <ContentEditable
                            excerpt={this.props.post.excerpt}
                            onChange={e => this.setData(e.target.value)}
                        />
                        <span className="label label-default">
                            Chars: {this.state.chars} / 160
                        </span>
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
