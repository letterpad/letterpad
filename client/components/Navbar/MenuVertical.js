import React, { Component } from "react";
import MenuTree from "./MenuTree";

let menuStore = [];

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.setData = this.setData.bind(this);
        this.state = {
            menu: []
        };
    }
    componentWillMount() {
        if (menuStore.length === 0) {
            menuStore = this.props.menu;
        }
        this.setState({ menu: menuStore });
    }

    setData(newData) {
        menuStore = newData;
        this.setState({ menu: newData });
    }
    render() {
        return (
            <MenuTree
                data={this.state.menu}
                permissions={[]}
                route={this.props.router.location.pathname}
                setData={this.setData}
            />
        );
    }
}
