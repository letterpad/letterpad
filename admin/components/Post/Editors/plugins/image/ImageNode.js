import React from "react";
/* eslint-disable react/prop-types */
const ImageNode = props => {
    return <img src={props.node.data.get("src")} />;
};

export default ImageNode;
