import styled from "styled-components";

const Wrapper = styled.div`
    position: fixed;
    width: 200px;
    margin-top: 60px;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

    @media (max-width: 991px) {
        position: relative;
        z-index: 99999;
        height: auto;
        width: 100%;
        padding: 0;
        &:after {
            content: normal;
        }

        .wrapper {
            margin-left: 0;
        }
    }
    .about-site {
        margin: 0px;
        color: #636363;
        padding: 0px 16px 28px;
        font-weight: 400;
        text-shadow: 0px 1px 0px #000;
    }
    .search-box {
        margin: 0 16px;
        padding-left: 10px;
        background: #282c36;
        input {
            border: none;
        }
    }
    a {
        color: rgba(255, 255, 255, 0.7);
        &:hover {
            color: #fff;
        }
    }
    .footer {
        height: 45px;
        display: flex;
        background: #292d37;
        align-items: center;
        padding: 0 18px;
        color: var(--color-text-primary-invert);
    }

    &.nav {
        width: 95%;
    }

    .nav.child_menu {
        display: block;
    }
`;

export default Wrapper;
