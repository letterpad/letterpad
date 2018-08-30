import styled from "styled-components";

const StyledTopBar = styled.div`
    display: flex;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    align-items: center;
    justify-content: space-between;
    position: fixed;
    width: 100%;
    padding: 10px 20px;
    z-index: 999;
    background: var(--bg-base);
    .left-block {
        display: flex;
    }
    .right-block {
        display: flex;
        align-items: center;
    }
`;

export default StyledTopBar;
