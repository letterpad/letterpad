import React, { Component } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout(Element) {
    return class extends Component {
        render() {
            const pageName = Element.type
                ? Element.type.name.toLowerCase()
                : "";
            const enhancedElement = React.cloneElement(Element, {
                ...this.props
            });
            const layout = "standard"; //another option: standard
            let classes = {
                navbarType:
                    layout == "standard"
                        ? "navbar navbar-default"
                        : "navbar navbar-custom"
            };
            const { settings } = enhancedElement.props;
            return (
                <div className={"main " + layout}>
                    <nav className={classes.navbarType}>
                        <div
                            className={
                                layout == "two-column" ? "sidebar" : "container"
                            }
                        >
                            <Navbar
                                settings={settings}
                                menu={JSON.parse(settings.menu.value)}
                                layout={layout}
                            />

                            {layout == "two-column" ? <Footer /> : ""}
                        </div>
                    </nav>

                    <main>{enhancedElement}</main>
                    <aside>
                        <Sidebar settings={settings} {...this.props} />
                    </aside>
                </div>
            );
        }
    };
}
