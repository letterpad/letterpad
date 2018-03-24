import React, { Component } from "react";
import Navbar from "../components/Navbar";

class ArticleTemplate extends Component {
    render() {
        const Element = this.props.component;
        return (
            <div className="site-wrapper">
                <header className="site-header outer">
                    <div className="inner">
                        <div className="site-nav">
                            <Navbar
                                {...this.props}
                                navClass="main-navigation"
                            />
                        </div>
                    </div>
                </header>
                <main id="site-main" className="site-main outer" role="main">
                    <div className="inner">
                        <Element {...this.props} />
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

export default ArticleTemplate;
