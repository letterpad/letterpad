import React from "react";
import classnames from "classnames";
import { cloneElement } from "../helper/clone";

/* eslint-disable react/prop-types */
export default ({ children, style, className, menuRef, ...rest }) => (
    <div
        className={classnames("menu hover-menu", className)}
        style={style}
        ref={menuRef}
    >
        {cloneElement(children, rest)}
    </div>
);
