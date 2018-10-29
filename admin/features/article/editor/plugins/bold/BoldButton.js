import React from "react";
import { boldMarkStrategy } from "./BoldUtils";
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
const BoldButton = ({ value, onChange, changeState, style, type }) => (
  <span
    style={style}
    className="button"
    type={type}
    onMouseDown={e => {
      e.preventDefault();
      return onChange(boldMarkStrategy(value.change()));
    }}
  >
    <span className="material-icons">format_bold</span>
  </span>
);
export default BoldButton;
