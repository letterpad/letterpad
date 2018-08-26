import styled from "styled-components";

const Wrapper = styled.article`
    margin: 8px 0px;
    border: 5px solid transparent;
    cursor: pointer;

    .theme-meta {
        height: 80px;
    }
    .theme-thumbnail {
        .theme-image {
            height: 180px;
            object-fit: cover;
            width: 100%;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
    }
    .theme-header {
        padding: 12px;
        border: 1px solid var(--color-border);
        border-top: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        .theme-name {
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
    }
`;

export default Wrapper;
