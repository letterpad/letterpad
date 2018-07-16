import React from "react";
import { applyBlockquote, hasBlock } from "./BlockquoteUtils";
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
const BlockquoteButton = ({ value, onChange, changeState, style }) => {
    const type = "block-quote";
    return (
        <span
            style={style}
            className="button"
            type={type}
            onMouseDown={e => {
                // check if this is already active
                const isActive = hasBlock(value, type);
                return onChange(
                    applyBlockquote(
                        value.change(),
                        isActive ? "paragraph" : type
                    )
                );
            }}
        >
            <span className="material-icons">format_quote</span>
        </span>
    );
};
export default BlockquoteButton;
