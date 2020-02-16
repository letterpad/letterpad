import React, { Component } from "react";
import Menu from "../menu";
import Footer from "../footer";

import StyledSidebar from "./Sidebar.css";

class Sidebar extends Component<any, any> {
  render() {
    const { settings, router } = this.props;
    return (
      <StyledSidebar>
        <div className="sidebar">
          <Menu settings={settings} router={router} />
          <Footer data={settings.site_footer.value} />
        </div>
      </StyledSidebar>
    );
  }
}

export default Sidebar;
