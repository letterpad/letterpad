import React, { Component } from "react";
import PropTypes from "prop-types";

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
            let modalDialogClass = this.props.dialogClassName || "";
            return (
                <div id={id} className={classes}>
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
                        <div className={"modal-dialog " + modalDialogClass}>
                            <div className="modal-content">
                                <WrappedComponent {...this.props} />
                            </div>
                        </div>
                    </div>
                    {this.state.isOpen ? (
                        <div
                            className={
                                "modal-backdrop fade" +
                                (this.state.isFadeIn ? " in" : "")
                            }
                        />
                    ) : null}
                </div>
            );
        }
    };
};
export default ModalHoc;
