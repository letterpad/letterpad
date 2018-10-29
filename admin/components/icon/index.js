import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledIcon = styled.span`
  margin-right: 8px;
`;

const Icon = ({ name }) => {
  return <StyledIcon className="material-icons">{name}</StyledIcon>;
};

Icon.propTypes = {
  name: PropTypes.string,
};

export default Icon;
