import React from "react";
import PropTypes from "prop-types";

import StyledSection from "../section";
import StyledCard from "../card";

const OhSnap = ({ message }) => (
  <StyledSection title="Oh Snap">
    <StyledCard subtitle={message} />
  </StyledSection>
);

OhSnap.propTypes = {
  message: PropTypes.string,
};
export default OhSnap;
