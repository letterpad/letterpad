import styled from "styled-components";

const StyledTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  padding: 10px 20px;
  z-index: 999;
  background: var(--bg-base);
  .left-block {
    display: flex;
    align-items: center;
  }
  .right-block {
    display: flex;
    align-items: center;
  }
`;

export const PublishBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  a:hover {
    text-decoration: none;
  }
  .meta-label {
    font-weight: 500;
    margin-bottom: 10px;
  }
  > div {
    margin-left: 20px;
    cursor: pointer;
  }
  .publish {
    .dropdown-menu {
      width: 340px;
      margin-left: -190px;
    }
  }
  .meta {
    .dropdown-menu {
      width: 320px;
      margin-left: -240px;
    }
  }
`;

export const PostStatusText = styled.span<{ status: string }>`
  font-size: 0.8rem;
  margin-left: 30px;
  border: 1px solid var(--color-border);
  padding: 3px 6px;
  border-radius: 4px;
  color: ${p =>
    p.status === "publish"
      ? "var(--bg-success)"
      : p.status === "draft"
      ? "#ce8809"
      : "var(--bg-danger)"};
`;

export const PostScheduledText = styled.span`
  color: var(--bg-success);
  font-size: 0.8rem;
  margin-left: 8px;
  border: 1px solid var(--color-border);
  padding: 3px 6px;
  border-radius: 4px;
`;
export default StyledTopBar;
