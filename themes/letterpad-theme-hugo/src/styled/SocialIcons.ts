import styled from "styled-components";

export default styled.nav`
    position: absolute;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    font-size: 0;
    .social-list {
        padding: 0;
        list-style: none;
        line-height: 2;
    }
    .social-item {
        display: inline-block;
        font-size: 1rem;
    }
    li + li {
        padding-left: 1rem;
    }

    @media screen and (max-width: 800px) {
        position: relative;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 2rem auto;
        max-height: 125px;
        overflow-y: hidden;
        transition: all ease-out 0.5s;
        &.collapsed {
            margin: 0 auto;
            max-height: 0;
        }
    }

    @media screen and (min-width: 800px) and (max-height: 768px) {
        display: none;
    }
`;
