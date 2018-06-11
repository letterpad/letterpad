import React, { Component } from "react";
import PropTypes from "prop-types";
import Notifications, { notify } from "react-notify-toast";
import { parseErrors } from "../../../shared/util";
import config from "../../../config";
import {
    forgotPassword,
    updateQueryWithData
} from "../../data-connectors/LoginConnector";

class LoginView extends Component {
    static propTypes = {
        login: PropTypes.func,
        history: PropTypes.object,
        settings: PropTypes.object,
        forgotPassword: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.state = {
            lostPassword: false
        };
        this.toggleForgotPwdView = this.toggleForgotPwdView.bind(this);
    }

    componentDidMount() {
        document.body.classList.add("login-view");
        this.usernameInput.focus();
        delete localStorage.token;
        document.querySelector(".login-view").style.backgroundImage = `url("${
            config.baseName
        }/admin/images/login_bg.jpg")`;
    }
    componentWillUnmount() {
        document.querySelector(".login-view").removeAttribute("style");
        document.body.classList.remove("login-view");
    }

    async login(e) {
        e.preventDefault();
        if (
            this.usernameInput.value.length === 0 ||
            this.passwordInput.value.length === 0
        ) {
            return;
        }
        const res = await this.props.login({
            username: this.usernameInput.value,
            password: this.passwordInput.value,
            remember: this.rememberMe.checked
        });
        if (!res.data.login.ok) {
            let errors = parseErrors(res.data.login);
            errors = errors.map(error => error.message);
            notify.show(errors.join("\n"), "warning", 33000);
        } else {
            localStorage.token = res.data.login.token;
            this.props.history.push("/admin/home");
        }
    }

    toggleForgotPwdView(e) {
        e.preventDefault();
        this.setState({ lostPassword: !this.state.lostPassword }, () => {
            if (this.state.lostPassword) {
                this.lostPwdEmailInput.focus();
            } else {
                this.usernameInput.focus();
            }
        });
    }

    async forgotPassword(e) {
        e.preventDefault();
        const email = this.lostPwdEmailInput.value.trim();
        if (email.length > 0) {
            e.currentTarget.disabled = true;
            const response = await this.props.forgotPassword({ email });
            e.currentTarget.disabled = false;
            if (response.data.forgotPassword.ok) {
                document.querySelector(".forgot-block").innerHTML =
                    "Great. Check your email to reset your password!";
            } else {
                notify.show(response.data.forgotPassword.msg, "warning", 3000);
            }
        } else {
            notify.show("Please fill up the email field.", "warning", 3000);
        }
    }

    render() {
        const classes = {
            login: this.state.lostPassword ? "hide" : "login-block",
            forgot: this.state.lostPassword ? "forgot-block" : "hide"
        };
        return (
            <div className="login-wrapper">
                <h2 className="brand text-center">
                    {this.props.settings.site_title.value}
                </h2>

                <div className="login">
                    <Notifications />
                    <form className={classes.login}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your username"
                            ref={input => {
                                this.usernameInput = input;
                            }}
                            autoComplete="off"
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            ref={input => {
                                this.passwordInput = input;
                            }}
                            autoComplete="off"
                        />
                        <div className="m-10">
                            <label>
                                <input
                                    type="checkbox"
                                    ref={input => {
                                        this.rememberMe = input;
                                    }}
                                />
                                <span className="label-text">
                                    {" "}
                                    Remember my password
                                </span>
                            </label>
                        </div>
                        <br />
                        <button
                            onClick={this.login}
                            className="btn btn-md btn-white pull-right"
                            type="submit"
                        >
                            Login
                        </button>
                    </form>
                    <form className={classes.forgot}>
                        <label htmlFor="username">
                            Enter your email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            ref={input => {
                                this.lostPwdEmailInput = input;
                            }}
                            autoComplete="off"
                        />
                        <br />
                        <button
                            onClick={this.forgotPassword}
                            className="btn btn-md btn-white"
                        >
                            Submit
                        </button>{" "}
                        <button
                            onClick={this.toggleForgotPwdView}
                            className="btn btn-md btn-white"
                        >
                            Cancel
                        </button>
                    </form>
                    <div
                        className={this.state.lostPassword ? "hide" : "m-t-10"}
                    >
                        <a
                            onClick={this.toggleForgotPwdView}
                            className="forgot-pwd"
                            href="#"
                        >
                            Lost your password ?
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
export default forgotPassword(updateQueryWithData(LoginView));
