import React from "react";
import styled from "styled-components";

const StyledIcon = styled.span`
  margin-right: 8px;
`;

const Icon: React.FC<{ name: string }> = ({ name }) => {
  return <StyledIcon className="material-icons">{name}</StyledIcon>;
};

export default Icon;
