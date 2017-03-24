import React, { Component } from "react";

export default class Footer extends Component {
    render() {
        return (
            <footer className="footer module-overlay-dark-3">
                <div className="container-fluid container-custom">
                    <div className="row">
                        <div className="col-sm-12">
                            <ul className="contact-info font-alt">
                                <li><a href="#">admin@ajaxtown.com</a></li>
                            </ul>
                            <div className="copyright text-center font-alt">
                                © 2015{" "}
                                <a href="#">Ajaxtown</a>
                                , All Rights Reserved.
                            </div>
                        </div>
                    </div>

                    <a className="to-top-link" href="#top">
                        <i className="fa fa-angle-up" />
                    </a>
                </div>
            </footer>
        );
    }
}
