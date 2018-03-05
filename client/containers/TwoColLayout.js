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
            const { settings } = enhancedElement.props;
            const layout = settings.layout_display.value;
            let classes = {
                navbarType:
                    layout == "centered"
                        ? "navbar navbar-default"
                        : "navbar navbar-custom"
            };
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
                                router={{ ...this.props }}
                            />

                            {layout == "two-column" ? (
                                <Footer data={settings.site_footer.value} />
                            ) : (
                                ""
                            )}
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
