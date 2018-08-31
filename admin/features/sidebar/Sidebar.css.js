import styled from "styled-components";

const Sidebar = styled.div`
    border-radius: 0px;
    background: var(--bg-sections);
    border: 0;
    padding: 0;
    margin: 0;
    position: fixed;
    height: 100%;
    width: 200px;

    .navbar-brand {
        font-weight: 600;
        font-size: 23px;
        text-transform: uppercase;
        letter-spacing: 2px;
        display: table-cell;
        vertical-align: middle;
        float: none;
        height: 70px;
        padding-top: 0;
        padding-bottom: 0;
        color: var(--color-accent);
        width: 100vw;
        text-shadow: 1px 1px 0 #000;
        text-decoration: none;
        small {
            display: block;
            font-size: 12px;
            font-family: "Source Sans Pro", sans-serif;
        }
    }

    .sidebar {
        position: fixed;
        width: 200px;
        margin-top: 60px;
        padding-top: 24px;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 999;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        border-right: 1px solid var(--color-border);

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
            border-top: 1px solid var(--color-border);
            align-items: center;
            padding: 0 18px;
            color: var(--color-base);
        }
    }
`;

export default Sidebar;
