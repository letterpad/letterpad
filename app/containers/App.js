import React, { Component } from "react";
import Header from "../components/Header";
import Menu from "../components/Menu";
require("../../public/css/common.scss");
import "../../public/css/admin.scss";

export default class App extends Component {
    render() {
        return (
            <div>
                <Menu />
                {React.cloneElement(this.props.children, this.props)}
            </div>
        );
    }
}
