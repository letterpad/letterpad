import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 40px;
  h3 {
    font-size: 1rem;
    margin-bottom: 8px;
    font-weight: 400;
    margin-top: 0px;
  }
  p {
    color: var(--base-shade-3);
  }
`;

const TitleHeader: React.FC<any> = ({ title, subtitle }) => {
  return (
    <Wrapper className="section-header">
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </Wrapper>
  );
};

export default TitleHeader;
