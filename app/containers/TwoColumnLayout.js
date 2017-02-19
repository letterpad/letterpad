import React from "react";
import Sidebar from "../components/Sidebar";

export default function TwoColumnLayout(Component) {
    return class extends React.Component {

        constructor(props) {
            super(props)
        }

        render() {
            return (
                <div>
                <Sidebar/>
                    <div className="top_nav">
                        <div className="nav_menu">
                            <nav>
                                <div className="nav toggle">
                                    <a id="menu_toggle"><i className="fa fa-bars" /></a>
                                </div>
                                <ul className="nav navbar-nav navbar-right">
                                    <li className="">
                                        <a
                                            href="javascript:;"
                                            className="user-profile dropdown-toggle"
                                            data-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            John Doe
                                            <span className=" fa fa-angle-down" />
                                        </a>
                                        <ul className="dropdown-menu dropdown-usermenu pull-right">
                                            <li><a href="javascript:;"> Profile</a></li>
                                            <li>
                                                <a href="javascript:;">
                                                    <span className="badge bg-red pull-right">50%</span>
                                                    <span>Settings</span>
                                                </a>
                                            </li>
                                            <li><a href="javascript:;">Help</a></li>
                                            <li>
                                                <a href="login.html">
                                                    <i className="fa fa-sign-out pull-right" /> Log Out
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    <div className="right_col" role="main" style={{'minHeight': 'calc(100vh - 50px)'}}>

                        <Component {...this.props} />
                    </div>
                </div>
            );
        }
    };
}