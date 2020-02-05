import styled from "styled-components";

export default styled.div`
    display: flex;
    padding: 12px;
    margin: 40px 0px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    .author-avatar {
        padding: 16px 0;
        img {
            width: 65px;
            object-fit: cover;
            height: 64px;
            border-radius: 50%;
        }
    }
    .author-details {
        padding: 10px 20px;
        display: flex;
        flex-direction: column;
        .author-name {
            font-size: 16px;
            font-weight: 600;
        }
        .author-bio {
            font-size: 15px;
            opacity: 0.7;
            &:hover {
                opacity: 1;
            }
        }
    }
`;
