import React, { Component } from "react";
import Sidebar from "./Sidebar";

let headerMarkup = header => {
    if (!header) {
        return <div />;
    }
    return (
        <div>
            <section className="module-sm">
                <div className="container-fluid container-custom">
                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3">
                            <h2 className="module-title font-alt m-b-0">
                                {"{Page Name}"}
                            </h2>
                        </div>
                    </div>
                </div>
            </section>
            <hr className="divider" />
        </div>
    );
};

export default function Layout(Element, header = false) {
    return class Layout extends Component {
        render() {
            return (
                <div className="wrapper">

                    <section className={"module-xs"}>
                        <div className="container-fluid container-custom">
                            <div className="row">
                                <div className="col-sm-8 col-sm-offset-2">
                                    <Element {...this.props} />
                                </div>
                            </div>
                        </div>
                    </section>
                    <hr className="divider" />
                </div>
            );
        }
    };
}
