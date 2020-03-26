import Notifications, { notify } from "react-notify-toast";
import React, { Component } from "react";

import { resetPasswordQuery } from "../../data-connectors/LoginConnector";
import styled from "styled-components";

class ResetPassword extends Component<any, any> {
  passwordInput: any = null;
  cnfPasswordInput: any = null;

  componentDidMount() {
    document.body.classList.add("login-view");
    this.passwordInput.focus();
    delete localStorage.token;
  }

  componentWillUnmount() {
    document.body.classList.remove("login-view");
  }

  changePassword = async e => {
    e.preventDefault();
    if (
      this.cnfPasswordInput.value.length === 0 ||
      this.passwordInput.value.length === 0
    ) {
      notify.show(
        "Passwords cannot be empty. Fill all the fields",
        "warning",
        3000,
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
      token: urlSplit[3],
    });
    if (!res.data.resetPassword.ok) {
      notify.show(res.data.resetPassword.msg, "warning", 3000);
    } else {
      notify.show(res.data.resetPassword.msg, "success", 3000);
      this.props.history.push("/admin/login");
    }
  };

  render() {
    return (
      <Container className="login-wrapper">
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
      </Container>
    );
  }
}

export default resetPasswordQuery(ResetPassword);

const Container = styled.div`
  .login-view {
    color: #dcdcdc;
    background-repeat: no-repeat;
    background-size: cover;
    .login-wrapper {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 100vh;

      .brand {
        text-align: center;
        text-shadow: none;
        color: #151a21;
        font-weight: 400;
        font-size: 1.8rem;
        margin-bottom: 14px;
        font-family: "Source Sans Pro", sans-serif;
      }
      .login {
        width: 100%;
        max-width: 400px;
        padding: 40px 20px;
        form {
          input {
            text-transform: none;
            border: 1px solid #eee;
            color: #5a5b5c;
            font-size: 13px;
            width: 100%;
          }
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #f5f5f5 inset;
          }
          label {
            display: block;
            max-width: 100%;
            margin-bottom: 5px;
            font-weight: bold;
            letter-spacing: 4px;
            font-weight: 100;
            text-transform: uppercase;
            font-size: 11px;
            margin-top: 19px;
          }
          .form-signin-heading {
            margin-bottom: 18px;
            font-size: 30px;
            color: #5a5b5c;
          }
          .form-control {
            position: relative;
            height: auto;
            padding: 9px 8px;
            box-sizing: border-box;
            border: 1px solid #fff;
            background: #fff;
            &:focus {
              z-index: 2;
            }
          }
          .remember-me {
            display: flex;
            align-items: center;
            input {
              width: 24px;
            }
          }
        }
        a.forgot-pwd {
          color: #d7c8c8;
        }
        button {
          border: 1px solid #eee;
        }
      }
    }
  }
`;
