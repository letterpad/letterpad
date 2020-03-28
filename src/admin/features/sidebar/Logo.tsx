import React from "react";
import styled from "styled-components";

interface IProps {
  src?: string;
  siteName: string;
}
const Logo: React.FC<IProps> = ({ src, siteName }) => {
  if (src) {
    return (
      <Container>
        <img src={src} alt={siteName} />
      </Container>
    );
  }
  return (
    <Container>
      <h1>{siteName}</h1>
    </Container>
  );
};

export default Logo;
const Container = styled.div`
  height: 188px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--color-border);
`;
