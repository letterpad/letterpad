import React, { Component } from "react";
import PropTypes from "prop-types";
import Wrapper from "./Dropdown.css";

class DropDown extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    className: PropTypes.string,
    name: PropTypes.any,
    render: PropTypes.func,
  };

  static defaultProps = {
    render: () => {},
  };

  state = {
    open: false,
  };

  ddBtnRef = React.createRef();

  componentDidMount() {
    document.addEventListener("click", this.closeDropdowns);
  }

  closeDropdowns = e => {
    // dont close dropdown on selecting a tag in the publish dropdown
    if (e.target.parentNode.parentNode.className.indexOf("menu") >= 0) {
      return false;
    }
    // the admin panel publish dropwdown has tags. On deleting the tag, the dropdown closes
    // because the element(svg path in the close icon) is outside the parent container. This is to disallow that

    if (e.target.tagName.indexOf(["svg", "path"]) >= 0) return;
    if (
      this.ddBtnRef.current &&
      this.ddBtnRef.current.parentNode &&
      !this.ddBtnRef.current.parentNode.contains(e.target) &&
      this.state.open
    ) {
      this.setState({ open: false });
    }
  };

  toggle = (e, flag) => {
    e.preventDefault();
    this.setState({ open: flag ? flag : !this.state.open });
  };

  render() {
    const { name, className } = this.props;
    const ddClassPublish = " dropdown" + (this.state.open ? " open" : "");

    return (
      <Wrapper className={className + ddClassPublish}>
        <a
          className="dropdown-toggle"
          href="#"
          ref={this.ddBtnRef}
          onClick={this.toggle}
        >
          {name}
          <i className="material-icons">arrow_drop_down</i>
        </a>

        <div className="dropdown-menu">{this.props.render(this.toggle)}</div>
      </Wrapper>
    );
  }
}

export default DropDown;
