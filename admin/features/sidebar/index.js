import React, { Component } from "react";
import PropTypes from "prop-types";
import Menu from "../menu";
import Footer from "../footer";

import StyledSidebar from "./Sidebar.css";

class Sidebar extends Component {
  static propTypes = {
    settings: PropTypes.object,
  };

  render() {
    const { settings } = this.props;
    return (
      <StyledSidebar>
        <div className="sidebar">
          <Menu settings={settings} router={{ ...this.props }} />
          <Footer data={settings.site_footer.value} />
        </div>
      </StyledSidebar>
    );
  }
}

export default Sidebar;
