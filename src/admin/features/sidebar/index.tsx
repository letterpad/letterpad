import React, { Component } from "react";

import Footer from "../footer";
import Logo from "./Logo";
import Menu from "../menu";
import StyledSidebar from "./Sidebar.css";

class Sidebar extends Component<any, any> {
  render() {
    const { settings, router } = this.props;
    return (
      <StyledSidebar>
        <div className="sidebar">
          <div className="sidebar-top">
            <Logo
              src={settings.site_logo.value}
              siteName={settings.site_title.value}
            />
            <Menu settings={settings} router={router} />
          </div>
          <Footer data={settings.site_footer.value} />
        </div>
      </StyledSidebar>
    );
  }
}

export default Sidebar;
