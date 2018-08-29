import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import User from "./User";
import config from "../../../config";
import StyledHeader from "./Header.css";
import StyledLink from "../../components/link";

class Header extends Component {
    static propTypes = {
        settings: PropTypes.object,
        sidebarToggle: PropTypes.func,
        author: PropTypes.object
    };

    render() {
        const settings = this.props.settings;
        return (
            <StyledHeader>
                <div className="left-side">
                    <button
                        type="button"
                        className="navbar-toggle"
                        onClick={this.props.sidebarToggle}
                    >
                        <i className="material-icons">menu</i>
                    </button>
                    <Link className="navbar-brand brand" to={"/"}>
                        {settings.site_title.value}
                    </Link>
                </div>

                <div className="right-side">
                    <StyledLink
                        className="view-site"
                        target="_blank"
                        rel="noopener noreferrer"
                        to={config.baseName + "/"}
                    >
                        View Your site
                    </StyledLink>
                    <User author={this.props.author} />
                </div>
            </StyledHeader>
        );
    }
}
export default Header;
