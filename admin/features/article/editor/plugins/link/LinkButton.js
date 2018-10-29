/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import classnames from "classnames";

import { insertLinkStrategy, hasLinks } from "./LinkUtils";

const LinkButton = ({ value, onChange, className, style, type }) => (
  <span
    style={style}
    type={type}
    onMouseDown={() => onChange(insertLinkStrategy(value.change()))}
    className={classnames("button", { active: hasLinks(value) }, className)}
  >
    <span className="material-icons">insert_link</span>
  </span>
);

export default LinkButton;
