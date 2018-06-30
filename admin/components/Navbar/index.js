import React, { Component } from "react";
import PropTypes from "prop-types";

import MenuVertical from "./MenuVertical";
import DATA from "./constants";

class Navbar extends Component {
    static propTypes = {
        router: PropTypes.object,
        settings: PropTypes.object
    };

    state = { navbarOpen: false };

    navbarToggle = () => this.setState(s => ({ navbarOpen: !s.navbarOpen }));

    render() {
        const { router } = this.props;
        return (
            <div className="custom-menu">
                <MenuVertical menu={DATA} router={router} />
            </div>
        );
    }
}

export default Navbar;
