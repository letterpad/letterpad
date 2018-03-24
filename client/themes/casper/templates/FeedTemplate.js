import React, { Component } from "react";
import Header from "../components/Header";

class FeedTemplate extends Component {
    render() {
        const Element = this.props.component;
        return (
            <div className="site-wrapper">
                <Header {...this.props} navClass="main-navigation" showBg />

                <main id="site-main" className="site-main outer" role="main">
                    <div className="inner">
                        <div className="post-feed">
                            <Element {...this.props} />
                        </div>
                    </div>
                </main>
                <footer className="site-footer outer">
                    <div className="site-footer-content inner">
                        <section className="copyright">
                            <a href="/">Letterpad</a> © 2018
                        </section>
                        <nav className="site-footer-nav">
                            <a href="/">Latest Posts</a>
                            <a href="https://www.postleaf.org/" target="_blank">
                                Letterpad
                            </a>
                        </nav>
                    </div>
                </footer>
            </div>
        );
    }
}

export default FeedTemplate;
