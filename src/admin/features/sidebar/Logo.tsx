import React from "react";
import styled from "styled-components";

interface IProps {
  src?: string;
  siteName: string;
  setSearchMode: () => void;
}
const Logo: React.FC<IProps> = ({ src, siteName, setSearchMode }) => {
  if (src) {
    return (
      <Container className="sidebar-header">
        <div
          className="logo-container"
          style={{ backgroundImage: `url('${src}')` }}
        ></div>
        <i className="fa fa-search" onClick={setSearchMode} />
      </Container>
    );
  }
  return (
    <Container>
      <h1>{siteName}</h1>
      <i className="fa fa-search" onClick={setSearchMode} />
    </Container>
  );
};

export default Logo;
const Container = styled.div`
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
  border-bottom: 1px solid var(--color-border);
  h1 {
    font-size: 1.2rem;
    text-transform: uppercase;
  }
  .logo-container {
    width: 100px;
    height: 60px;
    background-size: contain;
    background-repeat: no-repeat;
    background-color: #fff;
  }
  img {
    width: 36px;
    background: #fff;
    padding: 4px;
    border-radius: 2px;
  }
  i {
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background: #333;
    }
  }
`;
