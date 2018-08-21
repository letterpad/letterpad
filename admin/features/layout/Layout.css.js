import styled from "styled-components";

export const StyledLayout = styled.div`
    display: grid;
    grid-template-areas: "header header" "nav content" "footer footer";
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto 1fr auto;
    background: var(--bg-base);
    color: var(--color-base);
    min-height: 100vh;

    ::-webkit-input-placeholder {
        color: var(--color-muted) !important;
        font-weight: 300;
    }

    @media screen and (max-width: 991px) {
        .masonry-grid-item {
            width: 100%;
        }
    }

    @media screen and (min-width: 992px) {
        .masonry-grid-item {
            width: 42%;
        }
    }
`;
