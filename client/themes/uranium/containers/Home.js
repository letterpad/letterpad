import React, { Component } from "react";
import PropTypes from "prop-types";
import Posts from "./Posts";
import SinglePage from "./SinglePage";

export default class Home extends Component {
    render() {
        // To get the homepage, parse the menu settings and see if there is any label by the name Home.
        // If not, then take the first item as the home
        const menu = JSON.parse(this.props.settings.menu.value);
        let home = menu.filter(item => item.label === "Home");
        if (home.length === 0) {
            home = [menu[0]];
        }
        if (home[0].type === "label") {
            home = [home[0].children[0]];
        }
        if (this.props.match.path === "/") {
            if (home[0].type === "category") {
                return <Posts slug={home[0].slug} {...this.props} />;
            }
        }
        return <SinglePage slug={home[0].slug} {...this.props} />;
    }
}

Home.propTypes = {
    settings: PropTypes.object,
    route: PropTypes.func,
    match: PropTypes.object
};
