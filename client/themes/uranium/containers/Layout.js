import React, { Component } from "react";
import Sidebar from "client/containers/Sidebar";
import Navbar from "client/components/Navbar";
import Footer from "client/components/Footer";
require("../../../../public/scss/client.scss");
require("../style.scss");

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
                            <Footer data={settings.site_footer.value} />
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
