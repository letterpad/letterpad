import React from "react";
/* eslint-disable react/prop-types */
const ListItemNode = ({ attributes, children }) => (
    <li {...attributes}>{children}</li>
);

export default ListItemNode;
