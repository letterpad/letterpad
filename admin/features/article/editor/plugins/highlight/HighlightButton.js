import React from "react";
import { highlightMarkStrategy } from "./HighlightUtils";
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
const highlightButton = ({ value, onChange, changeState, style, type }) => (
    <span
        style={style}
        className="button"
        type={type}
        onMouseDown={e => {
            e.preventDefault();
            return onChange(highlightMarkStrategy(value.change()));
        }}
    >
        <span className="material-icons">border_color</span>
    </span>
);
export default highlightButton;
