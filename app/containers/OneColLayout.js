import React, { Component } from "react";

export default function Layout(Element) {
    return class Layout extends Component {
        render() {
            return (
                <div>
                    <div className="wrapper">
                        <section className="module p-t-0">
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
                </div>
            );
        }
    };
}
