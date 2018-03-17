import React, { Component } from "react";
import Sidebar from "../containers/Sidebar";
import Navbar from "../components/Navbar";

export default function Layout(Element, props) {
    const settings = props.settings;
    const layout = settings.layout_display.value;

    return class extends Component {
        render() {
            const _props = { ...this.props, ...props, settings };
            return (
                <div className="main centered">
                    <nav className="navbar navbar-default">
                        <div className="container">
                            <Navbar
                                settings={settings}
                                position="top"
                                router={{ ...this.props }}
                            />
                        </div>
                    </nav>
                    <main>
                        <Element {..._props} />
                    </main>
                    <aside>
                        <Sidebar settings={settings} {...this.props} />
                    </aside>
                </div>
            );
        }
    };
}
