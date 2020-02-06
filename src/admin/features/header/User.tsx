import React, { Component } from "react";

import { IAuthor } from "../../../types/types";
import PropTypes from "prop-types";
import { QUERY_AUTHOR } from "../../../shared/queries/Queries";
import StyledDropdown from "../../components/dropdown";
import apolloClient from "../../../shared/apolloClient";
import config from "../../../config";

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
          width="80px"
          src={
            config.BASE_NAME +
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
              window.location.href = "/admin/login";
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
