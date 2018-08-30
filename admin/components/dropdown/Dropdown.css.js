import styled from "styled-components";

export default styled.div`
    position: relative;

    .dropdown-toggle {
        display: flex;
        align-items: center;
    }

    &.open > .dropdown-menu {
        display: block;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        display: none;
        float: left;
        min-width: 160px;
        font-size: 14px;
        text-align: left;
        list-style: none;
        background-color: var(--bg-base);
        color: var(--color-base);
        background-clip: padding-box;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
        overflow-y: auto;

        ul {
            margin: 0px;
            li {
                padding: 4px 8px;
                border-bottom: var(--color-border);
                &:last-child {
                    border: none;
                }
                a,
                a:focus,
                a:hover,
                a:active {
                    color: var(--color-base);
                }
                &:hover {
                    background: var(--bg-sections);
                }
            }
        }
    }
`;
