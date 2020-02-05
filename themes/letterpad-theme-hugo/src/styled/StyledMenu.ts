import styled from "styled-components";

export default styled.nav`
    text-transform: capitalize;
    .menu-list {
        list-style: none;
        padding: 0;

        @media screen and (min-width: 800px) {
            text-align: left;
            padding-left: 24px;
            font-size: 13px;
        }
    }
    .menu-item {
        padding: 0.7rem 0;
        a {
            display: inline-block;
            height: 1.5rem;
            line-height: 1.5;
            text-decoration: none;
        }
    }

    @media screen and (max-width: 800px) {
        overflow-y: hidden;
        max-height: 1000px;
        transition: max-height ease-out 0.5s;
        &.collapsed {
            max-height: 0;
        }
    }
`;
