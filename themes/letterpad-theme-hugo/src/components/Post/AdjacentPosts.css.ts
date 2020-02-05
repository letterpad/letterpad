import styled from "styled-components";

export default styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    padding: 20px 0;
    .adjacent-post-item {
        label {
            cursor: pointer;
            color: var(--color-base);
        }
        display: flex;
        flex-direction: column;
        color: #eee;
        &.previous {
            margin-right: 20px;
            text-align: left;
        }

        &.next {
            margin-left: 20px;
            text-align: right;
        }
    }
`;
