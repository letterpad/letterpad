import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)<any>`
  color: var(--color-accent)
    ${props => props.normal && "text-decoration: none;color: var(--color-base)"};
  &:hover {
    color: var(--color-accent);
  }
`;

const HyperLink: React.FC<any> = ({ children, normal, ...props }) => {
  return <StyledLink {...props}>{children}</StyledLink>;
};

export default HyperLink;
