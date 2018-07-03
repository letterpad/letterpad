import React from "react";
/* eslint-disable react/prop-types */
const LinebreakNode = ({ attributes }) => (
    <div {...attributes} style={{ fontSize: 20, textAlign: "center" }}>
        ---
    </div>
);

export default LinebreakNode;
