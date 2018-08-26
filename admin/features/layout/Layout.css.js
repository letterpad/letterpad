import styled from "styled-components";

export const defaultStyles = `
    background: var(--bg-base);
    color: var(--color-base);

    ::-webkit-input-placeholder {
        color: var(--color-muted) !important;
        font-weight: 300;
    }

    .material-icons {
        font-size: 14px;
    }
    hr {
        border-top: 1px solid var(--color-border);
    }
`;

export const StyledLayout = styled.div`
    display: grid;
    grid-template-areas: "header header" "nav content" "footer footer";
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;

    ${defaultStyles};
`;
