import React, { Component } from "react";
import Header from "../components/Header";

export default class App extends Component {
    render() {
        return (
            <div>
                <Header />
                <div className="page-container">
                    <div className="container">
                        {React.cloneElement(this.props.children, this.props)}
                    </div>
                </div>
            </div>
        );
    }
}
