import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export class MenuTree extends Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.state = {
            data: this.props.data,
            permissions: this.props.permissions,
            route: this.props.route
        };
    }

    onSelect(data) {
        const newData = this.props.data.map(item => {
            if (item.label === data.label) {
                return data;
            }
            return item;
        });
        this.props.setData(newData);
    }
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
    setData: PropTypes.func
};

class TreeNode extends Component {
    constructor(props) {
        super(props);
        this.state = { collapsed: true, selected: "" };
        this.onClick = this.onClick.bind(this);
    }
    componentDidMount() {
        if ("collapsed" in this.props.data && !this.props.data.collapsed) {
            this.state.collapsed = this.props.data.collapsed;
        }

        this.state.selected =
            this.props.data.slug === this.props.route ? "active" : "";
        this.setState(this.state);
    }

    onClick(e) {
        e.preventDefault();
        this.setState({
            collapsed: !this.state.collapsed
        });
        this.props.data.collapsed = !this.state.collapsed;
        this.props.setSelection(this.props.data);
    }

    render() {
        const { t } = this.context;
        const checkPerm = permission =>
            this.props.permissions.indexOf(permission) !== -1;

        let subtree = null;
        if (this.props.data.children) {
            subtree = this.props.data.children
                .sort((a, b) => a.priority - b.priority)
                .map(child => (
                    <TreeNode
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
                            <i
                                className={
                                    "menu-icon fa " + this.props.data.icon
                                }
                            />
                        )}
                        <span>{t(this.props.data.label)}</span>
                    </Link>
                    <ul className={containerClassName + " nav nav-list"}>
                        {subtree}
                    </ul>
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
                    <span>{t(this.props.data.label)}</span>
                </Link>
            </li>
        );
    }
}

TreeNode.propTypes = {
    setSelection: PropTypes.func,
    data: PropTypes.object,
    permissions: PropTypes.array,
    route: PropTypes.string
};
TreeNode.contextTypes = {
    t: PropTypes.func
};
export default TreeNode;
