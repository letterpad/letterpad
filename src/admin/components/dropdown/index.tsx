import React, { Component } from "react";

import Wrapper from "./Dropdown.css";

class DropDown extends Component<any, any> {
  static defaultProps = {
    render: () => {},
  };

  state = {
    open: false,
  };

  ddBtnRef = React.createRef<HTMLAnchorElement>();

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
    if (!this.ddBtnRef.current) return;
    if (
      this.ddBtnRef.current["parentNode"] &&
      !this.ddBtnRef.current["parentNode"].contains(e.target) &&
      this.state.open
    ) {
      this.setState({ open: false });
    }
  };

  toggle = (e: any, flag) => {
    if (e) {
      e.preventDefault();
    }
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
          onClick={e => this.toggle(e, !this.state.open)}
        >
          {name}
          <i className="material-icons">arrow_drop_down</i>
        </a>

        <div className="dropdown-menu">
          {this.props.render(this.state.open, this.toggle)}
        </div>
      </Wrapper>
    );
  }
}

export default DropDown;
