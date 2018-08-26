import styled from "styled-components";

const StyledHeader = styled.header`
    border-bottom: 1px solid var(--color-border);
    position: fixed;
    width: 100%;
    z-index: 1;
    background: var(--bg-base);
    padding-left: 12px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left-side {
        display: flex;
    }
    .right-side {
        display: flex;
        margin-right: 20px;

        .view-site {
            margin-right: 10px;
        }
    }
    button.navbar-toggle {
        margin: 0px;
        background: var(--bg-base);
        border: 1px solid var(--bg-base);
        color: var(--color-base);
        display: none;
        @media screen and (max-width: 998px) {
            display: block;
        }
    }
    .icon-bar {
        background: #fff;
    }
    .navbar-brand {
        font-weight: 600;
        font-size: 23px;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    .dropdown-menu {
        margin-left: -120px;
    }
`;

export default StyledHeader;
