import React, { Component } from "react";
import fetch from "isomorphic-fetch";
import { checkHttpStatus, parseJSON } from "../../utils/common";
import { browserHistory } from "react-router";

export default class LoginView extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        document.body.classList.add("login-view");
    }
    login(e) {
        e.preventDefault();
        if (
            this.usernameInput.value.length === 0 ||
            this.passwordInput.value.length === 0
        ) {
            return;
        }

        let that = this;
        fetch("/admin/doLogin", {
            method: "post",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: that.usernameInput.value,
                password: that.passwordInput.value
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    window.location = "/admin/posts";
                } catch (e) {
                }
            })
            .catch(error => {
                alert("Authentication failed");
            });
    }

    render() {
        return (
            <div className="login">
                <form className="form-signin">
                    <h2 className="form-signin-heading text-center">#!</h2>
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        ref={input => {
                            this.usernameInput = input;
                        }}
                        required=""
                        autofocus=""
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        ref={input => {
                            this.passwordInput = input;
                        }}
                        required=""
                    />
                    <br />
                    <button
                        onClick={this.login}
                        className="btn btn-md btn-info btn-block"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
            </div>
        );
    }
}
