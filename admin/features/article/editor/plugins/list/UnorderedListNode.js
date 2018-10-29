import React from "react";
/* eslint-disable react/prop-types */
const UnorderedListNode = ({ attributes, children }) => (
  <ul {...attributes}>{children}</ul>
);

export default UnorderedListNode;
