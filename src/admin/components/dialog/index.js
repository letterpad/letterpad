/* eslint-disable react/prop-types */
import React, { Component } from "react";

// import PropTypes from "prop-types";
import StyledModal from "./Modal.css";

//const ModalHoc = (WrappedComponent, id = "", classes = "") => {
export default class ModalHoc extends Component {
  // static propTypes = {
  //   isOpen: PropTypes.bool.isRequired,
  //   onClose: PropTypes.func,
  //   className: PropTypes.string,
  //   title: PropTypes.string,
  //   dialogClassName: PropTypes.string,
  //   stateName: PropTypes.string,
  //   children: PropTypes.node,
  // };

  state = {
    isOpen: this.props.isOpen,
    onEnter: false,
    onLeave: false,
    isVisible: false,
  };

  modalWrapperRef = React.createRef();

  timerIds = [];

  componentDidMount() {
    this.open();
  }

  componentWillUnmount() {
    this.clearSetUp();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.onEnter && nextState.onEnter) {
      return false;
    }
    return true;
  }

  open = () => {
    this.setUp();
    this.setState({ isOpen: true });
    this.timerIds.push(window.setTimeout(this.onEnter, 0));
    this.timerIds.push(window.setTimeout(this.onRemoveAppear, 200));
  };

  close = () => {
    this.onLeave();
    // delay cleanup so animations can complete before closing
    this.timerIds.push(window.setTimeout(this.cleanUp, 200));
  };

  setUp = () => {
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", this.onEscKeyDown, false);
  };

  clearSetUp = () => {
    document.body.classList.remove("modal-open");
    window.removeEventListener("keydown", this.onEscKeyDown, false);
  };

  onEnter = () => {
    this.setState({ onEnter: true });
  };

  onRemoveAppear = () => {
    this.setState({ onEnter: false, isVisible: true });
  };

  onLeave = () => {
    this.setState({ onLeave: true });
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

  render() {
    let className = "modal-window";

    className += this.state.isVisible ? " in" : "";
    className += this.state.onEnter ? " onEnter" : "";
    className += this.state.onLeave ? " onLeave" : "";

    return (
      <StyledModal className={className}>
        <div className="modal-wrapper">
          <div className="modal-header">
            <h3>{this.props.title}</h3>
            <div>
              <i onClick={this.close} className="material-icons">
                close
              </i>
            </div>
          </div>
          {this.props.children}
        </div>
        <div className="backdrop" />
      </StyledModal>
    );
  }
}
