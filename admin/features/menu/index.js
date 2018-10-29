import React, { Component } from "react";
import PropTypes from "prop-types";

import MenuVertical from "./MenuVertical";
import DATA from "./constants";

import StyledMenu from "./Menu.css";

class Menu extends Component {
  static propTypes = {
    router: PropTypes.object,
    settings: PropTypes.object,
  };

  render() {
    const { router } = this.props;
    return (
      <StyledMenu className="custom-menu">
        <MenuVertical menu={DATA} router={router} />
      </StyledMenu>
    );
  }
}

export default Menu;
