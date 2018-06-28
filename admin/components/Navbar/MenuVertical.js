import React, { Component } from "react";
import jwtDecode from "jwt-decode";
import PropTypes from "prop-types";

import { MenuTree } from "./MenuTree";

export default class Menu extends Component {
    static propTypes = {
        menu: PropTypes.arrayOf(PropTypes.object),
        router: PropTypes.object,
        settings: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            navbarOpen: false,
            data: props.menu,
            permissions: []
        };
    }

    componentWillMount() {
        if (typeof localStorage !== "undefined") {
            this.setState({
                permissions: jwtDecode(localStorage.token).permissions
            });
        }
    }

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
        const selected = this.props.router.location.pathname.replace(
            "/admin/",
            ""
        );
        const { permissions, data } = this.state;
        return (
            <MenuTree
                data={data}
                permissions={permissions}
                route={selected}
                setData={this.setData}
            />
        );
    }
}
