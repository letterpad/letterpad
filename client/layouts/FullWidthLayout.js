import React, { Component } from "react";
import Sidebar from "../containers/Sidebar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default class extends Component {
    render() {
        const props = this.props.component.props;
        const settings = props.settings;
        return (
            <div className="main two-column">
                <nav className="navbar navbar-custom">
                    <div className="sidebar">
                        <Navbar
                            settings={settings}
                            position="left"
                            router={{ ...props }}
                        />
                        <Footer data={settings.site_footer.value} />
                    </div>
                </nav>

                <main>{this.props.component}</main>
                <aside>
                    <Sidebar {...props} />
                </aside>
            </div>
        );
    }
}
