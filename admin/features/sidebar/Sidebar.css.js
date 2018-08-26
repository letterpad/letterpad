import styled from "styled-components";

const Sidebar = styled.div`
    border-radius: 0px;
    background: transparent;
    border: 0;
    padding: 0;
    margin: 0;
    position: fixed;
    height: 100%;
    width: 200px;
    ul.nav {
        font-weight: 300;
        letter-spacing: 1px;
    }

    .custom-menu {
        height: calc(100vh - 105px);
        overflow-y: auto;
    }
    .custom-menu > .nav-list {
        li.active a {
            color: var(--color-accent);
            font-weight: 500;
        }
        > li a {
            text-decoration: none;
            display: block;
            padding: 10px 15px;
            cursor: pointer;
            color: var(--color-menu-link);
        }
        > li > a {
            color: var(--color-menu-link);
            padding-left: 13px !important;
        }
        > li a:hover {
            border-left: 0px solid var(--color-accent);
        }
        .menu-icon {
            margin-top: 4px;
            margin-right: 8px;
        }
        li.has-sub {
            > a:first-child::after {
                content: " + ";
                margin-left: 100px;
                position: absolute;
            }
            &.open > a::after {
                content: " - ";
                margin-left: 100px;
                position: absolute;
            }
            /* Second level folder*/
            > ul.nav.nav-list {
                background: var(--bg-sections);
                /* Third level files*/
                > ul.nav.nav-list {
                    margin-left: 32px;
                    background: var(--bg-sections);
                }
            }
        }
    }

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

    .nav.nav-list {
        font-size: 13px;
        .accordian-heading {
            color: #fff;
        }
        > li > a {
            &:hover {
                background: transparent;
                color: #fff;
            }
            &:focus {
                background: transparent;
                border-color: transparent;
            }
        }
        .open > a {
            background: transparent;
            &:hover {
                background: transparent;
                color: #fff;
            }
            &:focus {
                background: transparent;
            }
        }
    }
    .sidebar {
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
    }
`;

export default Sidebar;
