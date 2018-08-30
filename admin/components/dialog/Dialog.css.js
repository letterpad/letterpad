import styled from "styled-components";

const StyledDialog = styled.div`
    .backdrop {
        opacity: 0;
        display: block;
        height: 100%;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 999;
        background: var(--bg-sections);
        transition: 0.2s all linear;
    }
    .dialog {
        transform: scale(0.7);
        &.in {
            opacity: 0.98;
            transform: scale(1);
        }
        &.onEnter {
            opacity: 0.98;
            transform: scale(1);
        }

        &.onLeave {
            opacity: 0;
            transform: scale(0.7);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            h3 {
                padding: 15px;
                margin: 0px;
            }
            .material-icons {
                color: var(--color-text-2);
                cursor: pointer;
            }
        }
        .modal-wrapper {
            height: 100%;
            display: grid;
            grid-template-rows: 52px auto 52px;

            .modal-body {
                overflow-y: auto;
                padding: 15px;
            }
            .modal-footer {
                display: flex;
                align-items: center;
                width: 100%;
                justify-content: flex-end;
                padding: 0px 28px;
            }
        }
    }
`;
export default StyledDialog;
