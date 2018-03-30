import React, { Component } from "react";
import Navbar from "../../components/Navbar";

require("../../public/pcss/client.scss");

export default function Layout(Element, props) {
    const settings = props.settings;
    const layout = settings.layout_display.value;

    return class extends Component {
        render() {
            const _props = { ...this.props, ...props, settings };
            return (
                <div className="main two-column">
                    <nav className="navbar navbar-custom">
                        <div className="sidebar">
                            <Navbar
                                settings={settings}
                                position="left"
                                router={{ ...this.props }}
                            />
                        </div>
                    </nav>
                    <main>
                        <Element {..._props} />
                    </main>
                </div>
            );
        }
    };
}
