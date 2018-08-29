import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
    color: rgba(var(--color-accent), 0.8);
    ${props =>
        props.normal && "text-decoration: none;color: var(--color-base)"};
    &:hover {
        color: rgba(var(--color-accent), 1);
    }
`;

const HyperLink = ({ children, ...props }) => {
    return <StyledLink {...props}>{children}</StyledLink>;
};

HyperLink.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default HyperLink;
