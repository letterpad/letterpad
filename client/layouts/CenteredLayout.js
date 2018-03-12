import React, { Component } from "react";
import Sidebar from "../containers/Sidebar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default class extends Component {
    render() {
        const props = this.props.component.props;
        const settings = props.settings;
        return (
            <div className="main centered">
                <nav className="navbar navbar-default">
                    <div className="container">
                        <Navbar
                            settings={settings}
                            menu={JSON.parse(settings.menu.value)}
                            layout={settings.layout_display.value}
                            router={{ ...this.props }}
                        />

                        <Footer data={settings.site_footer.value} />
                    </div>
                </nav>

                <main>{this.props.component}</main>
                <aside>
                    <Sidebar settings={settings} {...this.props} />
                </aside>
            </div>
        );
    }
}

// export default function Layout(Element) {
//     return class extends Component {
//         render() {
//             const pageName = Element.type
//                 ? Element.type.name.toLowerCase()
//                 : "";
//             const enhancedElement = React.cloneElement(Element, {
//                 ...this.props
//             });
//             const { settings } = enhancedElement.props;
//             const layout = settings.layout_display.value;
//             let classes = {
//                 navbarType:
//                     layout == "centered"
//                         ? "navbar navbar-default"
//                         : "navbar navbar-custom"
//             };
//             return (
//                 <div className={"main " + layout}>
//                     <nav className={classes.navbarType}>
//                         <div
//                             className={
//                                 layout == "two-column" ? "sidebar" : "container"
//                             }
//                         >
//                             <Navbar
//                                 settings={settings}
//                                 menu={JSON.parse(settings.menu.value)}
//                                 layout={layout}
//                                 router={{ ...this.props }}
//                             />

//                             {layout == "two-column" ? (
//                                 <Footer data={settings.site_footer.value} />
//                             ) : (
//                                 ""
//                             )}
//                         </div>
//                     </nav>

//                     <main>{enhancedElement}</main>
//                     <aside>
//                         <Sidebar settings={settings} {...this.props} />
//                     </aside>
//                 </div>
//             );
//         }
//     };
// }
