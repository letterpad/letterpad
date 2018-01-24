import React, { Component } from "react";
import Drawer from "material-ui/Drawer";
import { spacing, typography } from "material-ui/styles";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Avatar from "material-ui/Avatar";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import jwtDecode from "jwt-decode";
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import ChevronRightIcon from "material-ui-icons/ChevronRight";
import IconButton from "material-ui/IconButton";
import ListSubheader from "material-ui/List/ListSubheader";

import Collapse from "material-ui/transitions/Collapse";
import InboxIcon from "material-ui-icons/MoveToInbox";
import DraftsIcon from "material-ui-icons/Drafts";
import SendIcon from "material-ui-icons/Send";
import ExpandLess from "material-ui-icons/ExpandLess";
import ExpandMore from "material-ui-icons/ExpandMore";
import StarBorder from "material-ui-icons/StarBorder";
import { MenuTree } from "./TreeNode";

const drawerWidth = 240;
const data = [
    {
        id: 9,
        label: "Home",
        priority: 1,
        permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
        home: true,
        slug: "/admin/",
        icon: "home"
    },
    {
        id: 1,
        label: "Posts",
        priority: 1,
        permissions: [],
        icon: "collections_bookmark",
        collapsed: true,
        children: [
            {
                id: 1,
                label: "All Posts",
                priority: 1,
                permissions: [],
                slug: "/admin/posts",
                icon: "mail"
            },
            {
                id: 2,
                label: "New Post",
                priority: 2,
                permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
                slug: "/admin/post-new",
                icon: "add"
            },
            {
                id: 10,
                label: "Tags",
                priority: 2,
                permissions: ["MANAGE_SETTINGS"],
                slug: "/admin/tags",
                icon: "label"
            },
            {
                id: 11,
                label: "Categories",
                priority: 2,
                permissions: ["MANAGE_SETTINGS"],
                slug: "/admin/categories",
                icon: "loyalty"
            }
        ]
    },
    {
        id: 2,
        label: "Pages",
        priority: 2,
        permissions: [],
        icon: "insert_drive_file",
        collapsed: true,
        children: [
            {
                id: 1,
                label: "All Pages",
                priority: 1,
                permissions: [],
                slug: "/admin/pages",
                icon: "pages"
            },
            {
                id: 2,
                label: "New Page",
                priority: 2,
                permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
                slug: "/admin/page-new",
                icon: "add"
            }
        ]
    },
    {
        id: 3,
        label: "Media",
        priority: 3,
        permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
        slug: "/admin/media",
        icon: "photo_library"
    },
    {
        id: 4,
        label: "Settings",
        priority: 7,
        permissions: ["MANAGE_SETTINGS"],
        icon: "settings",
        collapsed: true,
        children: [
            {
                id: 1,
                label: "Menu",
                priority: 2,
                permissions: ["MANAGE_SETTINGS"],
                slug: "/admin/menu-builder",
                icon: "menu"
            },
            {
                id: 2,
                label: "Site",
                priority: 1,
                permissions: ["MANAGE_SETTINGS"],
                slug: "/admin/settings",
                icon: "build"
            }
        ]
    },

    {
        id: 6,
        label: "Profile",
        priority: 5,
        permissions: ["MANAGE_OWN_POSTS"],
        slug: "/admin/edit-profile",
        icon: "person"
    },
    {
        id: 7,
        label: "Authors",
        priority: 6,
        permissions: ["MANAGE_USERS"],
        slug: "/admin/authors",
        icon: "group"
    },
    {
        id: 8,
        label: "Themes",
        priority: 7,
        permissions: ["MANAGE_SETTINGS"],
        slug: "/admin/themes",
        icon: "border_color"
    }
];

const styles = theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4
    },
    drawerInner: {
        // Make the items inside not wrap when transitioning:
        width: drawerWidth
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar
    },
    drawerPaper: {
        position: "relative",
        height: "100%",
        width: drawerWidth,
        backgroundColor: theme.palette.common.darkBlack,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerPaperClose: {
        width: 60,
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    }
});

class LeftDrawer extends Component {
    constructor(props) {
        super(props);
        this.handleNestedListToggle = this.handleNestedListToggle.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.state = {
            open: false,
            data
        };
        this.setData = this.setData.bind(this);
        this.itemClicked = this.itemClicked.bind(this);

        this.permissions = [];
    }
    componentWillMount() {
        if (typeof localStorage !== "undefined") {
            this.permissions = jwtDecode(localStorage.token).permissions;
        }
        // const checkPerm = permission =>
        //     this.permissions.indexOf(permission) !== -1;

        // function filterMenu(data) {
        //     let hasPerms = true;
        //     return data.filter(item => {
        //         if (item.permissions.length > 0) {
        //             hasPerms =
        //                 item.permissions.filter(name => {
        //                     return checkPerm(name);
        //                 }).length > 0;
        //         }
        //         if (hasPerms && item.children) {
        //             item.children = filterMenu(item.children);
        //         }
        //         return hasPerms;
        //     });
        // }
        console.log(this.props.history.location.pathname);
        this.setState({ data: data });
    }

    setData(newData) {
        this.setState({ data: newData });
    }
    toggleItem(item, e) {
        e.preventDefault();
        this.state[item] = !this.state[item];
        this.setState(this.state);
    }
    handleToggle() {
        this.setState({
            open: !navDrawerOpen
        });
    }

    handleNestedListToggle(item) {
        this.setState({
            open: item.state.open
        });
    }

    itemClicked(slug) {
        this.props.history.push("/admin/" + slug);
    }
    render() {
        let { navDrawerOpen, classes, theme } = this.props;
        const selected = this.props.location.pathname;

        return (
            <Drawer
                type="permanent"
                classes={{
                    paper: classNames(
                        classes.drawerPaper,
                        !navDrawerOpen && classes.drawerPaperClose
                    )
                }}
                open={navDrawerOpen}
            >
                <div className={classes.drawerInner}>
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.props.handleDrawerToggle}>
                            {theme.direction === "rtl" ? (
                                <ChevronRightIcon />
                            ) : (
                                <ChevronLeftIcon />
                            )}
                        </IconButton>
                    </div>

                    {/*} <div style={styles.logo}>
                        {this.props.settings.site_title.value}
                    </div>
                    <div style={styles.loggedIn}>
                        Welcome back, <strong>{this.props.user.name}</strong>!
                        </div>*/}
                    <MenuTree
                        data={this.state.data}
                        permissions={this.permissions}
                        route={selected}
                        setData={this.setData}
                    />
                </div>
            </Drawer>
        );
    }
}

LeftDrawer.propTypes = {
    navDrawerOpen: PropTypes.bool,
    menus: PropTypes.array,
    username: PropTypes.string
};

export default withStyles(styles, { withTheme: true })(LeftDrawer);
