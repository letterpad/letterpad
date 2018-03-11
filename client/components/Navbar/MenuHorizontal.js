import React, { Component } from "react";
import MenuItems from "./MenuItems";

class Menuhorizontal extends Component {
    render() {
        return (
            <MenuItems
                ref="secondaryMenuItems"
                secondary={true}
                items={this.props.items}
            />
        );
    }
}

export default Menuhorizontal;
