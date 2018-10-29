import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ModalWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    top: 40px;
    position: fixed;
    left: 0px;
    z-index: 99999;
    width: 100vw;

    .modal {
        display: flex;
        flex-direction: column;
        max-width: 767px;
        width: 100%;
        box-shadow: var(--box-shadow);
        background: var(--bg-sections);

        .modal-header {
            display: flex;
            justify-content: space-between;
            padding: 24px 16px;
            align-items: center;
            height: 40px;
            border-bottom: 1px solid var(--color-border);

            .close {
                background: transparent;
                border: none;
                color: var(--color-base);
                font-size: 24px;
                cursor: pointer;
            }
        }

        .modal-body {
            max-height: 80vh;
            overflow-y: auto;
            flex: 1;
            padding: 40px 14px;
            text-align: center;
        }

        .modal-footer {
            border-top: 1px solid var(--color-border);
            padding: 14px;
            display: flex;
            justify-content: flex-end;
        }
    }
`;

const ModalHoc = (WrappedComponent, id = "", classes = "") => {
    return class extends Component {
        static propTypes = {
            isOpen: PropTypes.bool.isRequired,
            onClose: PropTypes.func,
            className: PropTypes.string,
            dialogClassName: PropTypes.string,
            stateName: PropTypes.string
        };

        state = {
            isOpen: this.props.isOpen,
            isFadeIn: this.props.isOpen
        };

        modalWrapperRef = React.createRef();

        timerIds = [];

        componentDidMount() {
            this.open();
        }

        componentWillUnmount() {
            this.clearSetUp();
        }

        open = () => {
            this.setUp();
            this.setState({ isOpen: true });
            this.timerIds.push(window.setTimeout(this.fadeIn, 0));
        };

        close = () => {
            this.fadeOut();
            // delay cleanup so animations can complete before closing
            this.timerIds.push(window.setTimeout(this.cleanUp, 600));
        };

        setUp = () => {
            document.body.classList.add("modal-open");
            window.addEventListener("keydown", this.onEscKeyDown, false);
        };

        clearSetUp = () => {
            document.body.classList.remove("modal-open");
            window.removeEventListener("keydown", this.onEscKeyDown, false);
        };

        fadeIn = () => {
            this.setState({ isFadeIn: true });
        };

        fadeOut = () => {
            this.setState({ isFadeIn: false });
        };

        onEscKeyDown = evt => {
            if (evt.keyCode !== 27) return;
            this.close();
        };

        cleanUp = () => {
            this.setState({ isOpen: false });
            if (typeof this.props.onClose !== "undefined") {
                this.props.onClose(this.props.stateName);
            }
            this.timerIds.forEach(timerId => {
                window.clearTimeout(timerId);
            });
        };

        handleClick = evt => {
            if (evt.target !== this.modalWrapperRef.current) return;
            evt.preventDefault();
            this.close();
        };

        submit = () => {
            /* unimplemented */
            /* this.props.onYes(this.close); */
        };

        render() {
            let style = this.state.isFadeIn ? { display: "flex" } : {};
            let modalClass = this.props.className || "";
            return (
                <ModalWrapper id={id} className={classes}>
                    <div
                        ref={this.modalWrapperRef}
                        onClick={this.handleClick.bind(this)}
                        className={
                            "modal fade" +
                            (this.state.isFadeIn ? " in " : "") +
                            modalClass
                        }
                        style={style}
                        role="dialog"
                    >
                        <WrappedComponent {...this.props} />
                    </div>
                </ModalWrapper>
            );
        }
    };
};
export default ModalHoc;
