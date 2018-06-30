import React, { Component } from "react";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import PropTypes from "prop-types";

import { MenuTree } from "./TreeNode";
import DATA from "./constants";

export default class Menu extends Component {
    static propTypes = {
        location: PropTypes.object,
        settings: PropTypes.object
    };

    state = {
        navbarOpen: false,
        data: DATA,
        permissions:
            typeof localStorage !== "undefined"
                ? jwtDecode(localStorage.token).permissions
                : []
    };

    setData = newData => {
        this.setState({ data: newData });
    };

    toggleItem = (item, e) => {
        e.preventDefault();
        this.setState(s => ({ [item]: !s[item] }));
    };

    navbarToggle = () => {
        this.setState(s => ({ navbarOpen: !s.navbarOpen }));
    };

    render() {
        const navbarStatus = this.state.navbarOpen ? "in" : "";
        const selected = this.props.location.pathname.replace("/admin/", "");

        return (
            <div className="sidebar distractor">
                <nav className="navbar navbar-custom">
                    <div className="navbar-header">
                        <button
                            type="button"
                            className="navbar-toggle"
                            data-toggle="collapse"
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
                        className={`collapse navbar-collapse  ${navbarStatus}`}
                    >
                        <div id="menutree">
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
                    <p
                        dangerouslySetInnerHTML={{
                            __html: this.props.settings.site_footer.value
                        }}
                    />
                </div>
            </div>
        );
    }
}
