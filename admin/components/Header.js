import React, { Component } from "react";
import { Link } from "react-router-dom";
import User from "./TopBar/User";
import config from "../../config";
import PropTypes from "prop-types";

class Header extends Component {
    static propTypes = {
        settings: PropTypes.object,
        sidebarToggle: PropTypes.func,
        author: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        const settings = this.props.settings;
        return (
            <header>
                <div className="left-side">
                    <button
                        type="button"
                        className="navbar-toggle collapsed"
                        onClick={this.props.sidebarToggle}
                    >
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                    </button>
                    <Link
                        className="navbar-brand brand"
                        to={config.baseName + "/"}
                    >
                        {settings.site_title.value}
                    </Link>
                </div>

                <div className="right-side">
                    <a
                        className="view-site"
                        target="_blank"
                        href={config.baseName + "/"}
                    >
                        View Your site
                    </a>
                    <User author={this.props.author} />
                </div>
            </header>
        );
    }
}
export default Header;
