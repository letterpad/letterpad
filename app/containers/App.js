import React, { Component } from "react";
import Header from "../components/Header";
// import Menu from "../components/Menu";
import "../../public/scss/admin.scss";

export default class App extends Component {
    render() {
        return <div>{React.cloneElement(this.props.children, this.props)}</div>;
    }
}
