import React, { Component } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Menu from "../components/Menu";

export default function Layout(Element) {
    return class extends Component {
        render() {
            const pageName = Element.type
                ? Element.type.name.toLowerCase()
                : "";
            // let ChildEle = Element;
            // if (typeof Element === "function") {
            //     ChildEle = <Element props={this.props} />;
            // }
            const enhancedElement = React.cloneElement(Element, {
                ...this.props
            });

            const { settings } = enhancedElement.props;
            return (
                <div className={"wrapper " + pageName}>
                    <Menu
                        settings={settings}
                        menu={JSON.parse(settings.menu.value)}
                    />

                    <section className="module-xs">
                        <div className="row">
                            <div className="col-lg-8 column">
                                {enhancedElement}
                            </div>
                            <div className="col-lg-4 column">
                                <Sidebar settings={settings} {...this.props} />
                            </div>
                        </div>
                    </section>

                    {/* <hr className="divider" />
                    <Footer /> */}
                </div>
            );
        }
    };
}
