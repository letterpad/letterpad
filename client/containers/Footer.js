import React, { Component } from "react";

export default class Footer extends Component {
    render() {
        return (
            <footer className="footer module-overlay-dark-3">
                <div className="container-fluid container-custom">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="copyright text-center font-alt">
                                © 2015{" "}
                                <a href="#">Ajaxtown</a>
                                , All Rights Reserved.
                            </div>
                        </div>
                    </div>

                    <a className="to-top-link hide" href="#top">
                        <i className="fa fa-angle-up" />
                    </a>
                </div>
            </footer>
        );
    }
}
