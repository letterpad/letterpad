import React, { Component } from "react";
import PropTypes from "prop-types";
import Navbar from "../navbar";
import Footer from "../footer";

import StyledSidebar from "./Sidebar.css";

class Sidebar extends Component {
    static propTypes = {
        settings: PropTypes.object
    };
    render() {
        const { settings } = this.props;
        return (
            <nav className="navbar navbar-custom">
                <StyledSidebar className="sidebar">
                    <Navbar settings={settings} router={{ ...this.props }} />
                    <Footer data={settings.site_footer.value} />
                </StyledSidebar>
            </nav>
        );
    }
}

export default Sidebar;
