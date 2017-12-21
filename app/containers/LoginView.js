import React, { Component } from "react";
import { Redirect } from "react-router";
import Notifications, { notify } from "react-notify-toast";
import { gql, graphql } from "react-apollo";
import { checkHttpStatus, parseJSON } from "../../utils/common";
import { browserHistory } from "react-router";
import { parseErrors } from "../../shared/util";

class LoginView extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        document.body.classList.add("login-view");
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
            password: this.passwordInput.value
        });
        if (!res.data.login.ok) {
            let errors = parseErrors(res.data.login);
            errors = errors.map(error => error.message);
            return notify.show(errors.join("\n"), "error", 3000);
        }
        localStorage.token = res.data.login.token;
        this.props.router.push("/admin/posts");
    }

    render() {
        return (
            <div className="login">
                <Notifications />
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

const LoginQuery = gql`
    mutation login($username: String!, $password: String!) {
        login(email: $username, password: $password) {
            ok
            token
            errors {
                message
                path
            }
        }
    }
`;
const updateQueryWithData = graphql(LoginQuery, {
    props: ({ mutate }) => ({
        login: data =>
            mutate({
                variables: data
            })
    })
});
export default updateQueryWithData(LoginView);
