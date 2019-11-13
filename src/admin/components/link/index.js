import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
  color: var(--color-accent)
    ${props => props.normal && "text-decoration: none;color: var(--color-base)"};
  &:hover {
    color: var(--color-accent);
  }
`;

const HyperLink = ({ children, ...props }) => {
  return <StyledLink {...props}>{children}</StyledLink>;
};

HyperLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default HyperLink;
