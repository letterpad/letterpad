import React, { Component } from "react";
import Drawer from "material-ui/Drawer";
import { spacing, typography } from "material-ui/styles";
import { white, blue600 } from "material-ui/styles/colors";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import RemoveRedEye from "material-ui/svg-icons/image/remove-red-eye";
import PersonAdd from "material-ui/svg-icons/social/person-add";
import ContentLink from "material-ui/svg-icons/content/link";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Avatar from "material-ui/Avatar";
import { List, ListItem, makeSelectable } from "material-ui/List";
import ActionGrade from "material-ui/svg-icons/action/grade";
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ContentDrafts from "material-ui/svg-icons/content/drafts";
import ContentSend from "material-ui/svg-icons/content/send";
import Subheader from "material-ui/Subheader";

let SelectableList = makeSelectable(List);
// import TreeNode, { MenuTree } from "./_TreeNode";
import jwtDecode from "jwt-decode";
import style from "material-ui/svg-icons/image/style";

const data = [
    {
        id: 1,
        label: "Posts",
        priority: 1,
        permissions: [],
        home: true,
        icon: "collections_bookmark",
        collapsed: false,
        children: [
            {
                id: 1,
                label: "All Posts",
                priority: 1,
                permissions: [],
                slug: "posts"
            },
            {
                id: 2,
                label: "New Post",
                priority: 2,
                permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
                slug: "post-new"
            }
        ]
    },
    {
        id: 2,
        label: "Pages",
        priority: 2,
        permissions: [],
        icon: "insert_drive_file",
        children: [
            {
                id: 1,
                label: "All Pages",
                priority: 1,
                permissions: [],
                slug: "pages"
            },
            {
                id: 2,
                label: "New Page",
                priority: 2,
                permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
                slug: "page-new"
            }
        ]
    },
    {
        id: 3,
        label: "Media",
        priority: 3,
        permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
        slug: "media",
        icon: "photo_library"
    },
    {
        id: 4,
        label: "Settings",
        priority: 7,
        permissions: ["MANAGE_SETTINGS"],
        icon: "settings",
        children: [
            {
                id: 1,
                label: "Menu",
                priority: 2,
                permissions: ["MANAGE_SETTINGS"],
                slug: "menu-builder"
            },
            {
                id: 2,
                label: "Site Settings",
                priority: 1,
                permissions: ["MANAGE_SETTINGS"],
                slug: "settings"
            }
        ]
    },

    {
        id: 6,
        label: "Profile",
        priority: 5,
        permissions: ["MANAGE_OWN_POSTS"],
        slug: "edit-profile",
        icon: "person"
    },
    {
        id: 7,
        label: "Authors",
        priority: 6,
        permissions: ["MANAGE_USERS"],
        slug: "authors",
        icon: "group"
    },
    {
        id: 8,
        label: "Themes",
        priority: 7,
        permissions: ["MANAGE_SETTINGS"],
        slug: "themes",
        icon: "border_color"
    }
];

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
        const checkPerm = permission =>
            this.permissions.indexOf(permission) !== -1;

        function filterMenu(data) {
            let hasPerms = true;
            return data.filter(item => {
                if (item.permissions.length > 0) {
                    hasPerms =
                        item.permissions.filter(name => {
                            return checkPerm(name);
                        }).length > 0;
                }
                if (hasPerms && item.children) {
                    item.children = filterMenu(item.children);
                }
                return hasPerms;
            });
        }

        this.setState({ data: filterMenu(data) });
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
            open: !this.state.open
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
        let { navDrawerOpen } = this.props;
        const selected = this.props.location.pathname.split("/")[2];
        const styles = {
            logo: {
                cursor: "pointer",
                fontSize: 16,
                color: typography.textFullWhite,
                lineHeight: `${spacing.desktopKeylineIncrement}px`,
                fontWeight: typography.fontWeightLight,
                backgroundColor: blue600,
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "3px",
                height: 56
            },
            listItem: {
                color: white,
                fontSize: 10
            },
            avatar: {
                div: {
                    padding: "15px 0 20px 15px",
                    background: "#000"
                },
                icon: {
                    float: "left",
                    display: "block",
                    marginRight: 15,
                    boxShadow: "0px 0px 0px 8px rgba(0,0,0,0.2)"
                },
                span: {
                    paddingTop: 12,
                    display: "block",
                    color: "white",
                    fontWeight: 300,
                    textShadow: "1px 1px #444"
                }
            }
        };
        let value = 0;
        let selectedValue = 2;
        const createMenu = data => {
            return data.map((item, i) => {
                value += 1;
                if (item.slug === selected) {
                    selectedValue = value;
                }
                let nestedItems = [];
                if (item.children) {
                    nestedItems = createMenu(item.children);
                }
                if (nestedItems.length > 0) {
                    return (
                        <ListItem
                            className="list-item"
                            key={i}
                            value={value}
                            initiallyOpen={true}
                            primaryTogglesNestedList={true}
                            nestedItems={nestedItems}
                            primaryText={item.label}
                            leftIcon={
                                item.icon && (
                                    <i className="material-icons">
                                        {item.icon}
                                    </i>
                                )
                            }
                        />
                    );
                }
                return (
                    <ListItem
                        className="list-item"
                        value={value}
                        insetChildren={true}
                        key={i}
                        onClick={() => this.itemClicked(item.slug)}
                        primaryText={item.label}
                        leftIcon={
                            item.icon && (
                                <i className="material-icons">{item.icon}</i>
                            )
                        }
                    />
                );
            });
        };
        const menu = createMenu(this.state.data);
        return (
            <Drawer docked={true} open={navDrawerOpen}>
                <div style={styles.logo}>
                    {this.props.settings.site_title.value}
                </div>
                <div style={styles.avatar.div}>
                    <Avatar
                        src="http://www.material-ui.com/images/uxceo-128.jpg"
                        size={50}
                        style={styles.avatar.icon}
                    />
                    <span style={styles.avatar.span}>
                        {this.props.username}
                    </span>
                </div>
                <div>
                    <SelectableList
                        value={selectedValue}
                        style={{ fontSize: "10px" }}
                    >
                        {menu}
                    </SelectableList>
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

export default LeftDrawer;
