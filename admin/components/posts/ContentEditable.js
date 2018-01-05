import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

export default class ContentEditable extends Component {
    constructor(props) {
        super(props);
        this.emitChange = this.emitChange.bind(this);
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.title !== ReactDOM.findDOMNode(this).innerHTML;
    }
    emitChange() {
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
    render() {
        return (
            <h2
                style={{ color: "initial" }}
                onInput={this.emitChange}
                placeholder={this.props.placeholder}
                onBlur={this.emitChange}
                contentEditable
                dangerouslySetInnerHTML={{
                    __html: this.props.title || "Draft.."
                }}
            />
        );
    }
}

ContentEditable.propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    title: PropTypes.string
};
