import React from "react";
import styled from "styled-components";
/* eslint-disable react/prop-types */

const Image = styled.img`
    display: block;
    max-width: 100%;
    box-shadow: ${props => (props.selected ? "0 0 0 2px blue;" : "none")};
`;

const ImageNode = ({ node, attributes, isFocused }) => {
    return (
        <Image
            src={node.data.get("src")}
            selected={isFocused}
            {...attributes}
        />
    );
};

export default ImageNode;
