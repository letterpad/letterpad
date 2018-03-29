import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default class MenuTree extends Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.state = {
            data: this.props.data,
            permissions: this.props.permissions,
            route: this.props.route
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });
    }

    onSelect(data) {
        const newData = this.props.data.map(item => {
            if (item.label === data.label && item.name === data.name) {
                return data;
            }
            return item;
        });
        this.props.setData(newData);
    }
    render() {
        const tree = this.state.data.map(child => (
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
        const newState = {};
        if ("collapsed" in this.props.data && !this.props.data.collapsed) {
            newState.collapsed = this.props.data.collapsed;
        }
        let slug = "";
        if (this.props.data.type === "page") {
            slug = "/page/" + this.props.data.slug;
        } else if (this.props.data.type == "category") {
            slug = "/posts/" + this.props.data.slug;
        }
        newState.selected = slug === this.props.route ? "active" : "";
        this.setState(newState);
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
        let subtree = null;
        if (this.props.data.children && this.props.data.children.length > 0) {
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

        if (subtree) {
            return (
                <li className={"has-sub open"}>
                    <Link
                        to="#"
                        className={linkclass}
                        onClick={this.onClick}
                        data-id={this.props.data.id}
                    >
                        <span>{this.props.data.name}</span>
                    </Link>
                    <ul className={" nav nav-list"}>{subtree}</ul>
                </li>
            );
        }
        let to = "/";
        if (this.props.data.type == "page") {
            to = "/page/" + this.props.data.slug;
        } else {
            to = "/posts/" + this.props.data.slug;
        }
        return (
            <li className={"tree-node-leaf " + this.state.selected}>
                <Link data-id={this.props.data.id} to={to}>
                    {this.props.data.icon && (
                        <i className={"menu-icon fa " + this.props.data.icon} />
                    )}
                    <span>{this.props.data.name}</span>
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
