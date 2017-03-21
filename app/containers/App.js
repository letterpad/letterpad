import React, { Component } from "react";
import Header from "../components/Header";
import "../../public/css/admin.scss";
export default class App extends Component {
    render() {
        return (
            <div className="page-container">
                <div className="container">
                    {React.cloneElement(this.props.children, this.props)}
                </div>
            </div>
        );
    }
}
