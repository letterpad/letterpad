import React, { Component } from "react";

export default class Header extends Component {
    render() {
        return (
            <div className="navbar navbar-default navbar-fixed-top" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button
                            type="button"
                            className="navbar-toggle"
                            data-toggle="offcanvas"
                            data-target=".sidebar-nav"
                        >
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <a className="navbar-brand" href="#">Cliptales</a>
                    </div>
                </div>
            </div>
        );
    }
}