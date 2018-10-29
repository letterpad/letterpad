import React from "react";
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
const LinkNode = ({ attributes, node, children }) => (
  <a {...attributes} className="link-node" href={node.data.get("href")}>
    {children}
  </a>
);

export default LinkNode;
