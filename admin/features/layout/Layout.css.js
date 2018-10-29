import styled from "styled-components";

export const defaultStyles = `
    background: var(--bg-base);
    color: var(--color-base);

    a {
        color: var(--color-accent);
        transition: all 0.125s cubic-bezier(0.3, 0.1, 0.58, 1);
        text-decoration: none;
    }
    
    a:hover,
    a:focus {
        text-decoration: none;
        outline: none;
        color: var(--color-accent);
    }
    a:hover {
        color: var(--link-hover);
    }

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

    background: var(--bg-base);

    main {
        background: var(--bg-base);
    }
    @media (max-width: 991px) {
        .main {
            grid-gap: 0px;
            grid-template-columns: 200px 1fr;
        }
    }
`;
