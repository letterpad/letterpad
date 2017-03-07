import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../redux/actions/ActionCreators";
import Header from "../components/Header";
import Footer from "../components/Footer";

class Main extends Component {
    render() {
        return (
            <div className="page-container">
                <header id="masthead" className="site-header">
                    <div className="site-branding">
                        <h1 className="site-title">
                            <a href="">A</a>
                        </h1>
                        <p className="site-description">Another Town on the Web</p>
                    </div>
                    <nav
                        id="site-navigation"
                        className="main-navigation"
                        role="navigation"
                    >
                        <button
                            className="menu-toggle"
                            aria-controls="site-navigation"
                            aria-expanded="false"
                        >
                            Primary Menu

                        </button>
                        <div className="menu">
                            <ul
                                className="list-reset nav-menu"
                                aria-expanded="false"
                            >
                                <li className="menu-item"><a href="">art</a></li>
                                <li className="menu-item"><a href="">design</a></li>
                            </ul>
                        </div>
                    </nav>
                </header>
                <div className="container">
                    {React.cloneElement(this.props.children, this.props)}
                    <Footer />
                </div>
            </div>
        );
    }
}

/*
  Here we create an <App/> component which is just our <Main/> component with it's props
  populated with our actions and our state
  We're injecting the data at the top level and passing it down, but you can connect() any component to make the actions and the store available to you.
*/
const mapStateToProps = state => {
    return {
        connections: state.connections
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            connectionClicked: ActionCreators.connectionClicked
        },
        dispatch
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
