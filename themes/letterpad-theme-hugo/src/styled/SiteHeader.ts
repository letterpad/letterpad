import styled from "styled-components";

export default styled.header`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 16rem;
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;
  background: rgba(var(--bg-sidebar), 1);
  .icon-menu,
  .icon-close {
    color: #a19e9e;
    cursor: pointer;
  }
  a {
    color: var(--color-menu-link);
    &.is-active {
      opacity: 1;
      color: rgba(var(--color-accent));
      font-weight: 700;
    }
    opacity: 0.9;
    &:focus,
    &:hover {
      opacity: 1;
      color: rgba(var(--color-accent));
    }
  }
  .title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 1rem auto;
    color: var(--color-base);
    margin-bottom: 0px;
  }
  .subtitle {
    margin-bottom: 3rem;
    margin-top: 0px;
    opacity: 0.9;
    color: var(--color-base);
  }
  @media screen and (max-width: 800px) {
    width: 100%;
    position: relative;
    .title,
    .subtitle {
      display: block;
    }
    .title {
      margin-top: 3rem;
      display: block;
    }
  }

  .search-box {
    margin-bottom: 40px;
    input.form-control {
      color: #fff;
      border: none;
      border-bottom: 1px solid #333;
      background: transparent;
      color: var(--color-base);
      padding: 6px 0px;
      width: 80%;
      font-size: 13px;
    }
    @media screen and (max-width: 800px) {
      input.form-control {
        text-align: center;
      }
    }
  }
`;
