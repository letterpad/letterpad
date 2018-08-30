import styled from "styled-components";

const applyBasic = `
    background: none;
    border: none;
    color: background: var(--bg-primary);
    &:hover {
        background: var(--base-shade-1);
    }
`;
const applyRaised = `
    background: none;
    border: 1px solid var(--bg-primary);
    color: background: var(--bg-primary);
    &:hover {
        background: var(--bg-primary);
        color: background: var(--color-primary);
        border: 1px solid var(--bg-primary);
    }
`;

const StyledButton = styled.button`
    border-radius: 0px;
    cursor: pointer;
    position: relative;
    font-size: 13px;
    text-decoration: none;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    margin-right: 4px;
    padding: 10px 15px;
    letter-spacing: 1px;
    font-weight: 600;
    text-transform: uppercase;

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
        if (props.sm) return "7px 10px";
        if (props.lg) return "15px 20px";
        return "10px 15px";
    }};
    
    font-size: ${props => {
        if (props.sm) return "10px";
        if (props.lg) return "13";
        return "11px";
    }};

    ${props => props.basic && applyBasic}
    ${props => props.raised && applyRaised}


`;

export default StyledButton;
