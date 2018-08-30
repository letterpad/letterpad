import React from "react";
import { applyLinebreak } from "./LinebreakUtils";
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
const LinebreakButton = ({ value, onChange, changeState, style, type }) => (
    <span
        style={style}
        className="button"
        type={type}
        onMouseDown={e => {
            return onChange(applyLinebreak(value.change(), type));
        }}
    >
        <span className="material-icons">more_horiz</span>
    </span>
);
export default LinebreakButton;
