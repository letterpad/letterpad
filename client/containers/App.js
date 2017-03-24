import React, { Component } from "react";
import Header from "../components/Header";
import Menu from "../components/Menu";

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
