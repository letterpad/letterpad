import React, { Component } from "react";
import { Link } from "react-router";

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navbarOpen: false
        };
    }
    navbarToggle() {
        this.setState({ navbarOpen: !this.state.navbarOpen });
    }

    render() {
        let navbarStatus = this.state.navbarOpen ? "in" : "";
        return (
            <div className="sidebar">
                <nav className="navbar navbar-custom font-alt">
                    <div className="navbar-header">
                        <button
                            type="button"
                            className="navbar-toggle"
                            data-toggle="collapse"
                            data-target="#custom-collapse"
                            onClick={this.navbarToggle.bind(this)}
                        >
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>

                        <Link className="navbar-brand" to="/">
                            Dashboard
                        </Link>
                    </div>

                    <div
                        className={"collapse navbar-collapse " + navbarStatus}
                        id="custom-collapse"
                    >

                        <ul className="nav navbar-nav">
                            <li><Link to="/admin/posts">All Posts</Link></li>
                            <li><Link to="/admin/post-new">New Post</Link></li>

                        </ul>
                    </div>

                </nav>

                <div className="copyright">
                    <div className="social-icons m-b-20">
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-facebook facebook"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-twitter twitter"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-instagram instagram"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-behance behance"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-dribbble dribbble"
                        />
                    </div>

                    <p>© 2017 Ajaxtown</p>
                </div>

            </div>
        );
    }
}
