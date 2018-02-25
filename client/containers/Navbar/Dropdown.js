import React, { Component } from "react";
import Item from "./Item";

const Markup = ({ title, items, className, caret, toggleDropdown, isOpen }) => {
    const actions = toggleDropdown
        ? { onMouseOver: toggleDropdown, onMouseOut: toggleDropdown }
        : {};
    const classes = isOpen ? className + " open" : className;
    return (
        <li className={classes} {...actions}>
            <a
                href="#"
                className="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
            >
                {title}
                {caret && <span className="caret" />}
            </a>

            <ul className="dropdown-menu">{items}</ul>
        </li>
    );
};

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.state = {
            open: false
        };
    }

    toggleDropdown() {
        this.setState({ open: !this.state.open });
    }

    render() {
        const recurssiveDD = children => {
            return children.map((item, index) => {
                const ref = `i${index}`;
                if (item.children.length > 0) {
                    return (
                        <Markup
                            className="dropdown-submenu"
                            title={item.name}
                            items={recurssiveDD(item.children)}
                        />
                    );
                }
                return <Item {...item} ref={ref} key={ref} />;
            });
        };

        return (
            <Markup
                title={this.props.name}
                items={recurssiveDD(this.props.children)}
                caret
                isOpen={this.state.open}
                toggleDropdown={this.toggleDropdown}
            />
        );
    }
}

export default Dropdown;
