import React from "react";
import { italicMarkStrategy } from "./ItalicUtils";
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
const ItalicButton = ({ value, onChange, changeState, style, type }) => (
    <span
        style={style}
        className="button"
        type={type}
        onMouseDown={e => {
            e.preventDefault();
            return onChange(italicMarkStrategy(value.change()));
        }}
    >
        <span className="material-icons">format_italic</span>
    </span>
);
export default ItalicButton;
