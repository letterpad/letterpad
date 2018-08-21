import styled from "styled-components";

const StyledTopBar = styled.div`
    display: flex;
    box-shadow: 0 0 16px 0px #ddd;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    width: 100%;
    padding: 10px 20px;
    z-index: 999;

    .left-block {
        display: flex;
    }
    .right-block {
        display: flex;
        align-items: center;
    }
`;

export default StyledTopBar;
