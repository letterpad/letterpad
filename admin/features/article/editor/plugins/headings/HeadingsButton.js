import React from "react";
import { applyHeadings, hasBlock } from "./HeadingsUtils";
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
const HeadingsButton = ({ value, onChange, changeState, style, type }) => {
  return (
    <span
      style={style}
      className="button"
      type={type}
      onMouseDown={e => {
        e.preventDefault();
        // check if this is already active
        const isActive = hasBlock(value, type);
        return onChange(
          applyHeadings(value.change(), isActive ? "paragraph" : type),
        );
      }}
    >
      <span className="material-icons">{getType(type)}</span>
    </span>
  );
};

const getType = type => {
  switch (type) {
    case "heading-one":
      return "looks_one";
    case "heading-two":
      return "looks_two";
    case "heading-three":
      return "looks_3";
    case "heading-four":
      return "looks_4";
    case "heading-five":
      return "looks_5";
    case "heading-six":
      return "looks_6";

    default:
      break;
  }
};
export default HeadingsButton;
