import React, { Component } from "react";
import { Link } from "react-router";

export default class Sidebar extends Component {
    render() {
        return (
            <div className="col-md-3 left_col">
                <div className="left_col scroll-view">
                    <div className="navbar nav_title" style={{border: 0}}>
                        <a href="index.html" className="site_title">
                            <i className="fa fa-paw" /> <span>Dashboard</span>
                        </a>
                    </div>
                    <div className="clearfix" />
                    <br />

                    <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                        <div className="menu_section">
                            <h3>General</h3>
                            <ul className="nav side-menu">
                                <li>
                                    <a><i className="fa fa-home" /> Posts <span className="fa fa-chevron-down" /></a>
                                    <ul className="nav child_menu">
                                        <li><Link to="/admin/posts">All Posts</Link></li>
                                        <li><Link to="/admin/post-new">New Post</Link></li>
                                    </ul>
                                </li>
                                <li>
                                    <a><i className="fa fa-home" /> Pages <span className="fa fa-chevron-down" /></a>
                                    <ul className="nav child_menu">
                                        <li><Link to="/admin/pages">All Pages</Link></li>
                                        <li><Link to="/admin/page-new">New Page</Link></li>
                                    </ul>
                                </li>
                                <li>
                                    <a><i className="fa fa-edit" /> Settings <span className="fa fa-chevron-down" /></a>
                                    <ul className="nav child_menu">
                                        <li><Link to="/admin/menu">Menu</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        );
        return (
            <div className="col-xs-6 col-sm-3 sidebar-offcanvas" id="sidebar" role="navigation">
                <ul className="nav">
                    <li><Link to="/connections" className="active">Connections</Link></li>
                    <li><Link to="/posts" className="active">Posts</Link></li>
                </ul>
            </div>
        );
    }
}