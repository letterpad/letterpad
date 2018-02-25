import React, { Component } from "react";
import { Link } from "react-router-dom";
import MenuVertical from "./MenuVertical";
import MenuHorizontal from "./MenuHorizontal";

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navbarOpen: false
        };
    }
    navbarToggle() {
        this.setState({ navbarOpen: !this.state.navbarOpen });
    }

    render() {
        let navbarStatus = this.state.navbarOpen ? "in" : "";

        return (
            <div>
                <div className="navbar-header">
                    <button
                        type="button"
                        className="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target="#custom-collapse"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                    </button>
                    <Link className="navbar-brand brand" to="/">
                        {this.props.settings.site_title.value}
                    </Link>
                </div>

                <div
                    className={"collapse navbar-collapse " + navbarStatus}
                    id="custom-collapse"
                >
                    {this.props.layout == "two-column" ? (
                        <MenuVertical
                            menu={JSON.parse(this.props.settings.menu.value)}
                        />
                    ) : (
                        <MenuHorizontal
                            ref="secondaryMenuItems"
                            secondary={true}
                            items={JSON.parse(this.props.settings.menu.value)}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default Navbar;
