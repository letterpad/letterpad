import React, { Component } from "react";
import Sidebar from "../containers/Sidebar";

import Header from "../components/Header";
import FeedTemplate from "../templates/FeedTemplate";
import ArticleTemplate from "../templates/ArticleTemplate";

require("../assets/css/style.css");

export default function Layout(Element, props, name) {
    const settings = props.settings;
    const layout = settings.layout_display.value;

    return class extends Component {
        render() {
            const _props = { ...this.props, ...props, settings };

            if (name == "Home" || name == "Posts" || name == "SearchWrapper")
                return <FeedTemplate {..._props} component={Element} />;

            if (
                name == "SinglePage" ||
                name == "SinglePost" ||
                name == "SinglePage"
            )
                return <ArticleTemplate {..._props} component={Element} />;
            // return (
            //     <div className="">
            //         <Element {..._props} />

            //         <footer className="site-footer outer">
            //             <div className="site-footer-content inner">
            //                 <section className="copyright">
            //                     <a href="/">Letterpad</a> © 2018
            //                 </section>
            //                 <nav className="site-footer-nav">
            //                     <a href="/">Latest Posts</a>
            //                     <a
            //                         href="https://www.postleaf.org/"
            //                         target="_blank"
            //                     >
            //                         Letterpad
            //                     </a>
            //                 </nav>
            //             </div>
            //         </footer>
            //     </div>
            // );
        }
    };
}
