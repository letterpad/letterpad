import React, { Component } from "react";
import PropTypes from "prop-types";

import Item from "./Item";

const Markup = ({ title, items, className, caret, toggledropdown, isOpen }) => {
  const actions = toggledropdown
    ? { onMouseOver: toggledropdown, onMouseOut: toggledropdown }
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
Markup.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array.isRequired,
  className: PropTypes.string,
  caret: PropTypes.bool.isRequired,
  toggledropdown: PropTypes.func.isRequired,
  isOpen: PropTypes.func.isRequired,
};

class Dropdown extends Component {
  static propTypes = {
    name: PropTypes.string,
    children: PropTypes.array.isRequired,
  };

  state = {
    open: false,
  };

  toggledropdown = () => {
    this.setState(s => ({ open: !s.open }));
  };

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
        toggledropdown={this.toggledropdown}
      />
    );
  }
}

export default Dropdown;
