import React, { Component } from "react";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { MenuTree } from "./TreeNode";

const data = [
    {
        id: 1,
        label: "Posts",
        priority: 1,
        permissions: [],
        home: true,
        icon: "fa-book",
        collapsed: false,
        children: [
            {
                id: 1,
                label: "All Posts",
                priority: 1,
                permissions: [],
                slug: "posts",
                icon: "fa-envelope"
            },
            {
                id: 2,
                label: "New Post",
                priority: 2,
                permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
                slug: "post-new",
                icon: "fa-plus"
            }
        ]
    },
    {
        id: 2,
        label: "Pages",
        priority: 2,
        permissions: [],
        icon: "fa-file",
        children: [
            {
                id: 1,
                label: "All Pages",
                priority: 1,
                permissions: [],
                slug: "pages",
                icon: "fa-envelope"
            },
            {
                id: 2,
                label: "New Page",
                priority: 2,
                permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
                slug: "page-new",
                icon: "fa-plus"
            }
        ]
    },
    {
        id: 3,
        label: "Media",
        priority: 3,
        permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
        slug: "media",
        icon: "fa-picture-o"
    },
    {
        id: 4,
        label: "Settings",
        priority: 7,
        permissions: ["MANAGE_SETTINGS"],
        icon: "fa-cog",
        children: [
            {
                id: 1,
                label: "Menu",
                priority: 2,
                permissions: ["MANAGE_SETTINGS"],
                slug: "menu-builder",
                icon: "fa-bars"
            },
            {
                id: 2,
                label: "Site Settings",
                priority: 1,
                permissions: ["MANAGE_SETTINGS"],
                slug: "settings",
                icon: "fa-user"
            }
        ]
    },

    {
        id: 6,
        label: "Profile",
        priority: 5,
        permissions: ["MANAGE_OWN_POSTS"],
        slug: "edit-profile",
        icon: "fa-user"
    },
    {
        id: 7,
        label: "Authors",
        priority: 6,
        permissions: ["MANAGE_USERS"],
        slug: "authors",
        icon: "fa-users"
    },
    {
        id: 8,
        label: "Themes",
        priority: 7,
        permissions: ["MANAGE_SETTINGS"],
        slug: "themes",
        icon: "fa-paint-brush"
    }
];
export default class Menu extends Component {
    constructor(props) {
        super(props);

        this.setData = this.setData.bind(this);
        this.navbarToggle = this.navbarToggle.bind(this);
        this.state = {
            navbarOpen: false,
            data
        };
        this.permissions = [];
    }

    componentWillMount() {
        if (typeof localStorage !== "undefined") {
            this.permissions = jwtDecode(localStorage.token).permissions;
        }
        this.setState({ data });
    }

    setData(newData) {
        this.setState({ data: newData });
    }
    toggleItem(item, e) {
        e.preventDefault();
        this.state[item] = !this.state[item];
        this.setState(this.state);
    }
    navbarToggle() {
        this.setState({ navbarOpen: !this.state.navbarOpen });
    }
    render() {
        const navbarStatus = this.state.navbarOpen ? "in" : "";

        const selected = this.props.location.pathname.replace("/admin/", "");

        return (
            <div className="sidebar">
                <nav className="navbar navbar-custom">
                    <div className="navbar-header">
                        <button
                            type="button"
                            className="navbar-toggle"
                            data-toggle="collapse"
                            data-target="#custom-collapse"
                            onClick={this.navbarToggle}
                        >
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>

                        <Link className="navbar-brand brand" to="/">
                            {this.props.settings.site_title.value}
                            <small>
                                {this.props.settings.site_tagline.value}
                            </small>
                        </Link>
                    </div>

                    <div
                        className={`collapse navbar-collapse + ${navbarStatus}`}
                        id="custom-collapse"
                    >
                        <div id="cssmenu1">
                            <MenuTree
                                data={this.state.data}
                                permissions={this.permissions}
                                route={selected}
                                setData={this.setData}
                            />
                        </div>
                    </div>
                </nav>

                <div className="copyright">
                    <p>© 2017 Ajaxtown</p>
                </div>
            </div>
        );
    }
}
