import React, { Component } from "react";
import PropTypes from "prop-types";
import Posts from "./Posts";
import Page from "./Page";

export default class Home extends Component {
    render() {
        //  so this is the homepage. Lets see what to display
        const menu = JSON.parse(this.props.settings.menu.value);
        let home = menu.filter(item => item.label === "Home");
        if (home.length === 0) {
            home = [menu[0]];
        }
        if (this.props.match.path === "/") {
            if (home[0].type === "category") {
                return <Posts slug={home[0].slug} {...this.props} />;
            }
        }
        return <Page slug={home[0].slug} {...this.props} />;
    }
}

Home.propTypes = {
    settings: PropTypes.object,
    route: PropTypes.func,
    match: PropTypes.object
};
