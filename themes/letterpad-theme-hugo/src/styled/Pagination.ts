import styled from "styled-components";

export default styled.div`
  text-align: center;
  margin-top: 80px;
  margin-bottom: 80px;
  ul.pagination {
    display: inline-block;
    padding: 0;
    margin: 0;
    li {
      display: inline;
      &:first-child a {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:last-child a {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      a {
        float: left;
        padding: 2px 12px;
        text-decoration: none;
        transition: background-color 0.3s;
        border: 1px solid rgba(var(--color-accent));
        color: var(--color-base);

        &.active {
          background: rgba(var(--color-accent), 0.8);
          border-color: rgba(var(--color-accent));
          color: var(--color-base);
          font-weight: 500;
        }
        &:hover:not(.active) {
          background: rgba(var(--color-accent), 0.8);
          border-color: rgba(var(--color-accent));
          color: var(--color-base);
        }
      }
      &:not(:first-child) a {
        border-left: none;
      }
    }
  }
`;
