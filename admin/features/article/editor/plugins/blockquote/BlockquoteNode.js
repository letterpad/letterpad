import React from "react";
/* eslint-disable react/prop-types */
const BlockquoteNode = ({ attributes, children }) => (
  <blockquote {...attributes}>{children}</blockquote>
);

export default BlockquoteNode;
