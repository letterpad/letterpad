import React from "react";
import { applyCodeblock } from "./CodeblockUtils";

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
const codeblockButton = ({ value, onChange, style, type, node }) => (
    <span
        style={style}
        className="button"
        type={type}
        onMouseDown={e => {
            return onChange(applyCodeblock(value.change()));
        }}
    >
        <span className="material-icons">code</span>
    </span>
);

export default codeblockButton;
