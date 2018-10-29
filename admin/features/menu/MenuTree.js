import React, { Component } from "react";
import PropTypes from "prop-types";

import TreeNode from "./TreeNode";

export class MenuTree extends Component {
  state = {
    data: this.props.data,
    permissions: this.props.permissions,
    route: this.props.route,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      route: nextProps.route,
      data: prevState.data,
    };
  }

  onSelect = data => {
    const newData = this.props.data.map(item => {
      if (item.name === data.name) {
        return data;
      }
      return item;
    });
    this.setState({ data: newData });
    this.props.setData(newData);
  };

  render() {
    const sorted = this.state.data.sort((a, b) => a.priority - b.priority);

    const tree = sorted.map(child => (
      <TreeNode
        permissions={this.state.permissions}
        key={child.id}
        data={child}
        route={this.state.route}
        setSelection={this.onSelect}
      />
    ));

    return <ul className="nav nav-list">{tree}</ul>;
  }
}

MenuTree.propTypes = {
  data: PropTypes.array,
  permissions: PropTypes.array,
  route: PropTypes.string,
  setData: PropTypes.func,
};
