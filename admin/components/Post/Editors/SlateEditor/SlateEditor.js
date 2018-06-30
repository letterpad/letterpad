import { PropTypes } from "prop-types";
import React, { Component } from "react";

import classnames from "classnames";
import { isFunction } from "../helper/type-check";
import { cloneElement } from "../helper/clone";
// import { typeCheck } from "../helper";

class SlateEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        };
    }

    onChange(change) {
        const value = change.value;
        this.setState({ value });
        const { onChange } = this.props;
        if (isFunction(onChange)) onChange(value);
    }

    changeState(state) {
        this.setState(state);
        this.props.onChange(state);
    }

    render() {
        const { children, style, className, plugins } = this.props;

        const childProps = {
            plugins,
            value: this.state.value,
            outerState: this.state,
            onChange: this.onChange.bind(this),
            changeState: this.changeState.bind(this)
        };

        return (
            <div
                className={classnames("editor--root", className)}
                style={style}
            >
                {cloneElement(children, childProps)}
            </div>
        );
    }
}

SlateEditor.propTypes = {
    initialState: PropTypes.object,
    children: PropTypes.any,
    style: PropTypes.any,
    className: PropTypes.any,
    plugins: PropTypes.any,
    onChange: PropTypes.any,
    value: PropTypes.any,
    editorChanged: PropTypes.func
};

export default SlateEditor;
