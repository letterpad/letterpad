import React, { Component } from "react";
import PropTypes from "prop-types";

import apolloClient from "../../../shared/apolloClient";
import { QUERY_AUTHOR } from "../../../shared/queries/Queries";
import StyledDropdown from "../../components/dropdown";
import config from "../../../config";
import { IAuthor } from "../../../types/types";

interface IUserProps {
  author: IAuthor;
}
interface IUserState {
  author: IAuthor;
  open: boolean;
}

class User extends Component<IUserProps, IUserState> {
  static propTypes = {
    author: PropTypes.object,
  };

  state = {
    open: false,
    author: this.props.author,
  };

  async componentDidMount() {
    const isAdmin = true;
    let response = await apolloClient(isAdmin).query({
      query: QUERY_AUTHOR,
      variables: { id: this.props.author.id },
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
              window.location.href = config.baseName + "/admin/login";
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
