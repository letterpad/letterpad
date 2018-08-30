import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import Dropdown from "./Dropdown";
import Item from "./Item";

class MenuItems extends Component {
    static propTypes = {
        secondary: PropTypes.string,
        items: PropTypes.array
    };

    render() {
        const className = classNames("nav navbar-nav", {
            "navbar-right": this.props.secondary
        });

        const items = this.props.items.map((item, index) =>
            this.itemElement(item, `i${index}`)
        );

        return <ul className={className}>{items}</ul>;
    }

    itemElement(item, ref) {
        return item.children.length > 0 ? (
            <Dropdown {...item} ref={ref} key={ref} />
        ) : (
            <Item {...item} ref={ref} key={ref} />
        );
    }
}

export default MenuItems;
