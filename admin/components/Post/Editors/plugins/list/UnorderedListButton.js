import React from "react";

import classnames from "classnames";

import { unorderedListStrategy, isUnorderedList } from "./ListUtils";
/* eslint-disable react/prop-types */
const UnorderedListButton = ({ value, onChange, className, style, type }) => (
    <span
        style={style}
        type={type}
        onMouseDown={() => onChange(unorderedListStrategy(value.change()))}
        className={classnames(
            "button slate-list-plugin--button",
            { active: isUnorderedList(value) },
            className
        )}
    >
        <span className="material-icons">format_list_bulleted</span>
    </span>
);

export default UnorderedListButton;
