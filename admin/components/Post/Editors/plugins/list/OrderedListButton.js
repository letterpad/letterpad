import React from "react";
import classnames from "classnames";

import { orderedListStrategy, isOrderedList } from "./ListUtils";
/* eslint-disable react/prop-types */
const OrderedListButton = ({ value, onChange, className, style, type }) => (
    <span
        style={style}
        type={type}
        onMouseDown={() =>
            onChange(orderedListStrategy(value.change(), "ordered-list"))
        }
        className={classnames(
            "button slate-list-plugin--button",
            { active: isOrderedList(value) },
            className
        )}
    >
        <span className="material-icons">format_list_numbered</span>
    </span>
);

export default OrderedListButton;
