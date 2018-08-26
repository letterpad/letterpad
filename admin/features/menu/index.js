import React, { Component } from "react";
import PropTypes from "prop-types";

import MenuVertical from "./MenuVertical";
import DATA from "./constants";

class Menu extends Component {
    static propTypes = {
        router: PropTypes.object,
        settings: PropTypes.object
    };

    render() {
        const { router } = this.props;
        return (
            <div className="custom-menu">
                <MenuVertical menu={DATA} router={router} />
            </div>
        );
    }
}

export default Menu;
