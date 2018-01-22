import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Collapse from "material-ui/transitions/Collapse";
import InboxIcon from "material-ui-icons/MoveToInbox";
import DraftsIcon from "material-ui-icons/Drafts";
import SendIcon from "material-ui-icons/Send";
import ExpandLess from "material-ui-icons/ExpandLess";
import ExpandMore from "material-ui-icons/ExpandMore";
import StarBorder from "material-ui-icons/StarBorder";

export class MenuTree extends Component {
    constructor(props) {
        super(props);
        this.setSelection = this.setSelection.bind(this);
        this.state = {
            data: this.props.data,
            permissions: this.props.permissions,
            route: this.props.route
        };
    }

    setSelection(data) {
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

        const tree = sorted.map(child => {
            if (child.children) {
                child.children.map(subChild => {
                    if (subChild.slug === this.props.route) {
                        child.collapsed = false;
                    }
                });
            }
            return (
                <TreeNode
                    permissions={this.state.permissions}
                    key={child.id}
                    data={child}
                    route={this.state.route}
                    setSelection={this.setSelection}
                />
            );
        });

        return <List>{tree}</List>;
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
        this.itemClicked = this.itemClicked.bind(this);
    }
    componentDidMount() {
        if ("collapsed" in this.props.data) {
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
    itemClicked(slug) {
        this.props.route.push(slug);
    }

    render() {
        const classes = {
            listItemText: {
                color: "#FFF",
                backgroundColor: "red"
            }
        };

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
                <div>
                    <ListItem
                        button
                        onClick={this.onClick}
                        className="menu-item"
                    >
                        <ListItemIcon>
                            <i className="material-icons">
                                {this.props.data.icon}
                            </i>
                        </ListItemIcon>
                        <ListItemText inset primary={this.props.data.label} />
                        {this.state.collapsed ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                        component="div"
                        in={!this.state.collapsed}
                        timeout="auto"
                        unmountOnExit
                    >
                        <div
                            className="sub-menu-item"
                            style={{ paddingLeft: 0 }}
                        >
                            {subtree}
                        </div>
                    </Collapse>
                </div>
            );
        }
        return (
            <Link to={this.props.data.slug} className={this.state.selected}>
                <ListItem className="menu-item" button>
                    <ListItemIcon>
                        <i className="material-icons">{this.props.data.icon}</i>
                    </ListItemIcon>
                    <ListItemText inset primary={this.props.data.label} />
                </ListItem>
            </Link>
        );
    }
}

TreeNode.propTypes = {
    setSelection: PropTypes.func,
    data: PropTypes.object,
    permissions: PropTypes.array,
    route: PropTypes.string
};
export default TreeNode;
