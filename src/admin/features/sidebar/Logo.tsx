import React from "react";
import styled from "styled-components";

interface IProps {
  src?: string;
  siteName: string;
}
const Logo: React.FC<IProps> = ({ src, siteName }) => {
  if (src) {
    return (
      <Container className="sidebar-header">
        <img src={src} alt={siteName} />
        <i className="fa fa-search" />
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
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 40px;
  border-bottom: 1px solid var(--color-border);
  img {
    width: 36px;
    background: #fff;
    padding: 4px;
    border-radius: 2px;
  }
`;
