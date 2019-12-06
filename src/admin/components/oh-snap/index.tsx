import React from "react";

import StyledSection from "../section";
import StyledCard from "../card";

const OhSnap: React.FC<any> = ({ message }) => (
  <StyledSection title="Oh Snap">
    <StyledCard title="" subtitle={message} />
  </StyledSection>
);

// OhSnap.propTypes = {
//   message: PropTypes.string,
// };
export default OhSnap;
