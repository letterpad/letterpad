import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
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
                    <Link className="navbar-brand brand" to="/">
                        {settings.site_title.value}
                    </Link>
                </div>
                <div className="right-side">
                    <div className="social-icons">
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-facebook facebook"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-twitter twitter"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-instagram instagram"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-behance behance"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-dribbble dribbble"
                        />
                    </div>
                </div>
            </header>
        );
    }
}
export default Header;
