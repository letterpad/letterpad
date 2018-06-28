import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ContentEditable extends Component {
    shouldComponentUpdate(prevProps) {
        return prevProps.title !== this.node.innerHTML;
    }

    emitChange = () => {
        const title = this.node.innerHTML;
        if (this.props.onChange && title !== this.lastTitle) {
            this.props.onChange({
                target: {
                    value: title
                }
            });
        }
        this.lastTitle = title;
    };

    render() {
        return (
            <h2
                className="post-title"
                onInput={this.emitChange}
                placeholder={this.props.placeholder}
                onBlur={this.emitChange}
                contentEditable
                suppressContentEditableWarning
                ref={node => (this.node = node)}
            >
                {this.props.title}
            </h2>
        );
    }
}

ContentEditable.propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    title: PropTypes.string
};
