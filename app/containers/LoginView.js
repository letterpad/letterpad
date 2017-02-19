import React, { Component } from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../redux/actions/ActionCreators';

export class LoginView extends Component {

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
    }

    login(e) {
        e.preventDefault();
        if(this.usernameInput.value.length === 0 || this.passwordInput.value.length === 0) {
            return;
        }
        this.props.loginUser(this.usernameInput.value, this.passwordInput.value, '/admin/posts');
    }

    render() {
        return (
            <div className="login">
                <form className="form-signin">
                    <h2 className="form-signin-heading">Please login</h2>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        placeholder="Username"
                        ref={(input) => { this.usernameInput = input; }}
                        required=""
                        autofocus=""
                    />
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        ref={(input) => { this.passwordInput = input; }}
                        placeholder="Password"
                        required=""
                    />
                    <br />
                    <button onClick={this.login} className="btn btn-md btn-primary btn-block" type="submit">Login</button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticating: state.auth.isAuthenticating,
    statusText: state.auth.statusText
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loginUser: ActionCreators.loginUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
