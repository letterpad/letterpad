import React from "react";
import { underlineMarkStrategy } from "./UnderlineUtils";
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
const UnderlineButton = ({ value, onChange, changeState, style, type }) => (
    <span
        style={style}
        className="button"
        type={type}
        onMouseDown={e => {
            e.preventDefault();
            return onChange(underlineMarkStrategy(value.change()));
        }}
    >
        <span className="material-icons">format_underline</span>
    </span>
);
export default UnderlineButton;
