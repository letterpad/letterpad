import styled from "styled-components";

// const StyledModal = styled.div`
//     .modal-open .modal-window {
//         overflow-x: hidden;
//         overflow-y: auto;
//     }
//     .fade.in {
//         opacity: 1;
//     }
//     .modal-window {
//         position: fixed;
//         top: 0;
//         right: 0;
//         bottom: 0;
//         left: 0;
//         z-index: 1050;
//         display: none;
//         overflow: hidden;
//         outline: 0;
//         &.in .modal-dialog {
//             transform: translate(0, 0);
//         }
//         &.fade .modal-dialog {
//             transition: transform 0.3s ease-out;
//         }
//         .modal-content {
//             position: relative;
//             border: 1px solid #999;
//             border: 1px solid rgba(0, 0, 0, 0.2);
//             border-radius: 6px;
//             outline: 0;
//             box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);

//             .modal-header {
//                 min-height: 16.42857143px;
//                 padding: 15px;
//                 border-bottom: 1px solid #e5e5e5;
//             }
//             .modal-body {
//                 position: relative;
//                 padding: 15px;
//                 height: ${props =>
//                     props.full ? "calc(100vh - 110px)" : "auto"};
//             }
//             .modal-footer {
//                 padding: 15px;
//                 text-align: right;
//                 border-top: 1px solid #e5e5e5;
//             }
//         }
//         @media (min-width: 768px) {
//             .modal-dialog {
//                 width: ${props => (props.full ? "100%" : "600px")};
//                 margin: ${props => (props.full ? "0px" : "30px auto")};
//                 height: ${props => (props.full ? "100%" : "auto")};

//                 .modal-content {
//                     box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
//                 }
//             }
//         }
//     }
//     .modal-backdrop.fade {
//         filter: alpha(opacity=0);
//         opacity: 0;
//     }
// `;

const applyConfirmStyle = () => `
    width: 767px;
    left: 50%;
    margin-left: -353px;
    max-height: 80vh;
    margin-top: 10vh;
    position: absolute;
    height: auto;
    box-shadow: var(--box-shadow);
    background: var(--bg-sections);
`;
const StyledModal = styled.div`
    opacity: 0;
    display: block;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
    transition: 0.2s all linear;
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

    .modal-wrapper {
        height: 100%;
        display: grid;
        grid-template-rows: 52px minmax(min-content, max-content) 52px;
        top: 0px;
        left: 0px;
        height: 100vh;
        width: 100vw;
        position: fixed;
        background: var(--bg-sections);
        ${props => props.confirm && applyConfirmStyle()};
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-height: 16.42857143px;
            padding: 26px 16px;
            border-bottom: 1px solid var(--color-border);
            h3 {
                padding: 15px 0px;
                margin: 0px;
            }
            .material-icons {
                color: var(--color-text-2);
                cursor: pointer;
            }
        }
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
            border-top: 1px solid var(--color-border);
        }
    }

    .backdrop {
        position: relative;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        background: var(--base-shade-4);
        opacity: 1;
    }
`;
export default StyledModal;
