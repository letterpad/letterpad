import React, { Component } from "react";
import PropTypes from "prop-types";
import Notifications, { notify } from "react-notify-toast";
import { graphql } from "react-apollo";
import { parseErrors } from "../../shared/util";
import {
    LOGIN_QUERY,
    FORGOT_PASSWORD_QUERY,
    RESET_PASSWORD_QUERY
} from "../../shared/queries/Mutations";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.changePassword = this.changePassword.bind(this);
    }

    componentDidMount() {
        if (typeof document !== "undefined") {
            document.body.classList.add("login-view");
            this.passwordInput.focus();
            delete localStorage.token;
        }
    }
    componentWillUnmount() {
        document.body.classList.remove("login-view");
    }

    async changePassword(e) {
        e.preventDefault();
        if (
            this.cnfPasswordInput.value.length === 0 ||
            this.passwordInput.value.length === 0
        ) {
            notify.show(
                "Passwords cannot be empty. Fill all the fields",
                "warning",
                3000
            );
            return;
        }
        if (this.cnfPasswordInput.value !== this.passwordInput.value) {
            notify.show("Passwords dont match", "warning", 3000);
            return;
        }
        const urlSplit = this.props.location.pathname.split("/");
        if (urlSplit.length < 4) {
            notify.show("Token is missing", "warning", 3000);
            return;
        }
        const res = await this.props.resetPassword({
            password: this.passwordInput.value,
            token: urlSplit[3]
        });
        if (!res.data.resetPassword.ok) {
            notify.show(res.data.resetPassword.msg, "warning", 3000);
        } else {
            notify.show(res.data.resetPassword.msg, "success", 3000);
            this.props.history.push("/admin/login");
        }
    }

    render() {
        return (
            <div className="login-wrapper">
                <h2 className="brand text-center">
                    {this.props.settings.site_title.value}
                </h2>

                <div className="login">
                    <Notifications />
                    <form>
                        <label htmlFor="username">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your new password"
                            ref={input => {
                                this.passwordInput = input;
                            }}
                            autoComplete="off"
                        />
                        <label htmlFor="password">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm your password"
                            ref={input => {
                                this.cnfPasswordInput = input;
                            }}
                            autoComplete="off"
                        />
                        <br />
                        <button
                            onClick={this.changePassword}
                            className="btn btn-md btn-white pull-right"
                            type="submit"
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

ResetPassword.propTypes = {
    history: PropTypes.object
};

const resetPasswordQuery = graphql(RESET_PASSWORD_QUERY, {
    props: ({ mutate }) => ({
        resetPassword: data =>
            mutate({
                variables: data
            })
    })
});
export default resetPasswordQuery(ResetPassword);
