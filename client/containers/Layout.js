import React, { Component } from "react";
import Sidebar from "./Sidebar";
require("../../public/css/style.scss");

export default function Layout(Element) {
    return class Layout extends Component {
        render() {
            return (
                <div className="row">
                    <div className="col-lg-8">
                        <Element {...this.props} />
                    </div>
                    <div className="col-lg-4">
                        <Sidebar />
                    </div>
                </div>
            );
        }
    };
}
