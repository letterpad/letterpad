import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)``;

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
