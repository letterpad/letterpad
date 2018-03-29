import React, { Component } from "react";

class Header extends Component {
    render() {
        return (
            <div
                className="navbar navbar-inverse navbar-fixed-top"
                data-spy="affix"
                data-offset-top="100"
            >
                <div className="container">
                    <div className="navbar-header">
                        <button
                            type="button"
                            className="navbar-toggle collapsed"
                            data-toggle="collapse"
                            data-target="#navbar"
                            aria-expanded="false"
                            aria-controls="navbar"
                        >
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <a className="navbar-brand" href="#">
                            Ajaxtown
                        </a>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">

                        <ul className="nav navbar-nav navbar-right">
                            <li className="active">
                                <a href="#">Home</a>
                            </li>
                            <li>
                                <a href="#about">About</a>
                            </li>
                            <li>
                                <a href="#contact">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
export default Header;
