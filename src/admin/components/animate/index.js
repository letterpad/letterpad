import React, { Component } from "react";
import PropTypes from "prop-types";

class Animate extends Component<any, any> {
  static propTypes = {
    stateName: PropTypes.string,
    isOpen: PropTypes.func,
    onClose: PropTypes.func,
  };

  state = {
    isOpen: this.props.isOpen,
    onAppear: false,
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
    if (this.state.onAppear && nextState.onAppear) {
      return false;
    }
    return true;
  }

  open = () => {
    this.setUp();
    this.setState({ isOpen: true });
    this.timerIds.push(window.setTimeout(this.onAppear, 0));
    this.timerIds.push(window.setTimeout(this.onRemoveAppear, 300));
  };

  close = () => {
    this.onLeave();
    // delay cleanup so animations can complete before closing
    this.timerIds.push(window.setTimeout(this.cleanUp, 300));
  };

  setUp = () => {
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", this.onEscKeyDown, false);
  };

  clearSetUp = () => {
    document.body.classList.remove("modal-open");
    window.removeEventListener("keydown", this.onEscKeyDown, false);
  };

  onAppear = () => {
    this.setState({ onAppear: true });
  };

  onRemoveAppear = () => {
    this.setState({ onAppear: false, isVisible: true });
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
    return <div />;
  }
}

export default Animate;
