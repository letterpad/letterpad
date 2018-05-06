import React, { Component } from "react";
import { Link } from "react-router-dom";
import MenuVertical from "./MenuVertical";

const data = [
    {
        id: 9,
        name: "menu.home",
        priority: 1,
        permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
        home: true,
        slug: "home",
        icon: "fa-home"
    },
    {
        id: 1,
        name: "menu.posts",
        priority: 1,
        permissions: [],
        home: true,
        icon: "fa-book",
        collapsed: true,
        children: [
            {
                id: 1,
                name: "menu.allPosts",
                priority: 1,
                permissions: [],
                slug: "posts",
                icon: "fa-envelope"
            },
            {
                id: 2,
                name: "menu.newPost",
                priority: 2,
                permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
                slug: "post-new",
                icon: "fa-plus"
            },
            {
                id: 3,
                name: "menu.tags",
                priority: 3,
                permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
                slug: "tags",
                icon: "fa-plus"
            },
            {
                id: 4,
                name: "menu.categories",
                priority: 4,
                permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
                slug: "categories",
                icon: "fa-plus"
            }
        ]
    },
    {
        id: 2,
        name: "menu.pages",
        priority: 2,
        permissions: [],
        icon: "fa-file",
        children: [
            {
                id: 1,
                name: "menu.allPages",
                priority: 1,
                permissions: [],
                slug: "pages",
                icon: "fa-envelope"
            },
            {
                id: 2,
                name: "menu.newPage",
                priority: 2,
                permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
                slug: "page-new",
                icon: "fa-plus"
            }
        ]
    },
    {
        id: 3,
        name: "menu.media",
        priority: 3,
        permissions: ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"],
        slug: "media",
        icon: "fa-picture-o"
    },
    {
        id: 4,
        name: "menu.settings",
        priority: 7,
        permissions: ["MANAGE_SETTINGS"],
        icon: "fa-cog",
        children: [
            {
                id: 1,
                name: "menu.menu",
                priority: 2,
                permissions: ["MANAGE_SETTINGS"],
                slug: "menu-builder",
                icon: "fa-bars"
            },
            {
                id: 2,
                name: "menu.siteSettings",
                priority: 1,
                permissions: ["MANAGE_SETTINGS"],
                slug: "settings",
                icon: "fa-user"
            }
        ]
    },

    {
        id: 6,
        name: "menu.profile",
        priority: 5,
        permissions: ["MANAGE_OWN_POSTS"],
        slug: "edit-profile",
        icon: "fa-user"
    },
    {
        id: 7,
        name: "menu.authors",
        priority: 6,
        permissions: ["MANAGE_USERS"],
        slug: "authors",
        icon: "fa-users"
    },
    {
        id: 8,
        name: "menu.themes",
        priority: 7,
        permissions: ["MANAGE_SETTINGS"],
        slug: "themes",
        icon: "fa-paint-brush"
    }
];

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.navbarToggle = this.navbarToggle.bind(this);
        this.state = {
            navbarOpen: false
        };
    }

    navbarToggle() {
        this.setState({ navbarOpen: !this.state.navbarOpen });
    }

    render() {
        let navbarStatus = this.state.navbarOpen ? " in" : "";

        return (
            <div className="custom-menu">
                <MenuVertical
                    menu={data}
                    router={this.props.router}
                    settings={this.props.settings}
                />
            </div>
        );
    }
}

export default Navbar;
