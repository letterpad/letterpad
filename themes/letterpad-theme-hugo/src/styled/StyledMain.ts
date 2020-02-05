import styled from "styled-components";

export default styled.div`
  background: rgba(var(--bg-content), 1);
  color: var(--color-base);
  position: relative;
  margin-left: 16rem;
  padding: 1rem 2rem;
  min-height: 100vh;
  box-sizing: border-box;
  border-left: 1px solid rgba(0, 0, 0, 0.09);
  border-right: 1px solid rgba(0, 0, 0, 0.09);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

  .list-footer {
    padding: 1.5rem 0;
  }

  @media screen and (max-width: 1440px) {
    width: calc(100% - 16rem);
  }

  @media screen and (max-width: 800px) {
    margin-left: 0;
    padding: 0 1rem;
    width: 100%;
    min-height: initial;
    border-left: none;
    border-right: none;
    border-top: 1px solid rgba(0, 0, 0, 0.09);
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  }
  a {
    transition: 0.3s opacity linear;
    text-decoration: none;

    &:focus,
    &:hover {
      outline: none;
    }
  }
`;
