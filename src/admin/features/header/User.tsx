import React, { Component } from "react";
import PropTypes from "prop-types";

import appoloClient from "shared/apolloClient";
import { GET_AUTHOR } from "../../../shared/queries/Queries";
import config from "config";

import StyledDropdown from "../../components/dropdown";

class User extends Component {
  static propTypes = {
    author: PropTypes.object,
  };

  state = {
    open: false,
    author: {},
  };

  async componentDidMount() {
    const isAdmin = true;
    let response = await appoloClient(isAdmin).query({
      query: GET_AUTHOR,
      variables: { id: this.props.author.id },
      forceFetch: true,
      fetchPolicy: "network-only",
    });

    this.setState({ author: response.data.author });
  }

  toggledropdown = () => {
    this.setState({ open: !this.state.open });
  };

  closeDropdown = () => {
    setTimeout(() => {
      this.setState({ open: false });
    }, 100);
  };

  render() {
    const name = (
      <div>
        <img
          src={
            config.baseName +
            (this.state.author.avatar || "/admin/images/avatar.png")
          }
          className="avatar"
        />
      </div>
    );
    return (
      <div className="user-info" onMouseLeave={this.closeDropdown}>
        <StyledDropdown
          name={name}
          render={close => {
            const onClick = e => {
              e.preventDefault();
              close(e, false);
              window.location = config.baseName + "/admin/login";
            };
            return (
              <ul>
                <li onClick={onClick}>
                  <a href="#">Logout</a>
                </li>
              </ul>
            );
          }}
        />
      </div>
    );
  }
}

export default User;
