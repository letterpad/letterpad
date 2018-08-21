import styled from "styled-components";

const StyledButton = styled.button`
    border-radius: 0px;
    cursor: pointer;
    position: relative;
    font-size: 13px;
    text-decoration: none;
    transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
    margin-right: 4px;

    ${props => {
        if (props.danger) {
            return `
                color: var(--color-danger);
                background: var(--bg-danger);
                border: var(--bg-hover-danger);
                &:hover {
                    color: var(--color-hover-danger);
                    background: var(--bg-hover-danger);
                    border: var(--bg-danger);
                }
                `;
        }
        if (props.success) {
            return `
                color: var(--color-success);
                background: var(--bg-success);
                border: var(--bg-hover-success);
                &:hover {
                    color: var(--color-hover-success);
                    background: var(--bg-hover-success);
                    border: var(--bg-success);
                }
                `;
        }
        return `
            color: var(--color-primary);
            background: var(--bg-primary);
            border: var(--bg-hover-primary);
            &:hover {
                color: var(--color-hover-primary);
                background: var(--bg-hover-primary);
                border: var(--bg-primary);
            }
            `;
    }}

    padding: ${props => {
        if (props.sm) return "2px 10px";
        if (props.lg) return "6px 30px";
        return "4px 20px";
    }};


`;

export default StyledButton;
