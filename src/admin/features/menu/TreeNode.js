import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";

class TreeNode extends Component {
  state = {
    collapsed:
      "collapsed" in this.props.data ? this.props.data.collapsed : true,
    selected: this.props.data.slug === this.props.route ? "active" : "",
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {};
    if ("collapsed" in nextProps.data && !nextProps.data.collapsed) {
      newState.collapsed = prevState.collapsed;
    }

    newState.selected = nextProps.data.slug === nextProps.route ? "active" : "";
    return newState;
  }

  onClick = e => {
    e.preventDefault();
    this.setState(
      {
        collapsed: !this.state.collapsed,
      },
      () => {
        const data = {
          ...this.props.data,
          collapsed: this.state.collapsed,
        };
        this.props.setSelection(data);
      },
    );
  };

  render() {
    const { t } = this.props;
    const checkPerm = permission =>
      this.props.permissions.indexOf(permission) !== -1;

    let subtree = null;
    if (this.props.data.children) {
      subtree = this.props.data.children
        .sort((a, b) => a.priority - b.priority)
        .map(child => (
          <TreeNodeWithTranslations
            permissions={this.props.permissions}
            key={child.id}
            data={child}
            route={this.props.route}
            setSelection={this.props.setSelection}
          />
        ));
    }

    let containerClassName = "collapse in";
    let linkclass = "accordian-heading";
    let treeState = "open";
    if (this.state.collapsed) {
      linkclass += " collapsed";
      treeState = "";
      containerClassName = " collapse";
    }
    let hasPerms = true;
    const itemPermissions = this.props.data.permissions;
    if (itemPermissions && itemPermissions.length > 0) {
      hasPerms =
        itemPermissions.filter(name => {
          return checkPerm(name);
        }).length > 0;
    }
    if (!hasPerms) {
      return <div />;
    }

    if (subtree) {
      return (
        <li className={"has-sub " + treeState}>
          <Link
            href="#"
            to=""
            className={linkclass}
            onClick={this.onClick}
            data-id={this.props.data.id}
          >
            {this.props.data.icon && (
              <i className={"menu-icon fa " + this.props.data.icon} />
            )}
            <span className="name">{t(this.props.data.name)}</span>
          </Link>
          <ul className={containerClassName + " nav nav-list"}>{subtree}</ul>
        </li>
      );
    }
    return (
      <li className={"tree-node-leaf " + this.state.selected}>
        <Link
          data-id={this.props.data.id}
          to={"/admin/" + this.props.data.slug}
        >
          {this.props.data.icon && (
            <i className={"menu-icon fa " + this.props.data.icon} />
          )}
          <span className="name">
            {t ? t(this.props.data.name) : this.props.data.name}
          </span>
        </Link>
      </li>
    );
  }
}

TreeNode.propTypes = {
  setSelection: PropTypes.func,
  data: PropTypes.object,
  permissions: PropTypes.array,
  route: PropTypes.string,
  t: PropTypes.func,
};

const TreeNodeWithTranslations = translate("translations")(TreeNode);
export default TreeNodeWithTranslations;
