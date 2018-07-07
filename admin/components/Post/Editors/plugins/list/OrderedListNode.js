import React from "react";
/* eslint-disable react/prop-types */
const OrderedListNode = ({ attributes, children }) => (
    <ol {...attributes}>{children}</ol>
);

export default OrderedListNode;
