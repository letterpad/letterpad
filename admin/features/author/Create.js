import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";

import GetRoles from "../../data-connectors/GetRoles";
import CreateAuthorConnector from "../../data-connectors/CreateAuthorConnector";
import Loader from "../../components/loader";

import Basic from "./Basic";
import StyledButton from "../../components/button";
import StyledSection from "../../components/section";
import StyledCard from "../../components/card";
import StyledSelect from "../../components/select";

class Create extends Component {
  static defaultProps = {
    author: {
      fname: "",
      lname: "",
      email: "",
    },
  };

  static propTypes = {
    author: PropTypes.object,
    history: PropTypes.object,
    createAuthor: PropTypes.func,
    loading: PropTypes.bool,
    roles: PropTypes.array,
  };

  author = {};

  state = {
    selectedRole: "4",
  };

  componentDidMount() {
    this.setOption("role_id", this.state.selectedRole);
    document.body.classList.add("create-author-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("create-author-page");
  }

  selectRole = role_id => {
    this.setOption("role_id", role_id);
    this.setState({ selectedRole: role_id });
  };

  setOption = (option, value) => {
    this.author[option] = value;
  };

  submitData = async e => {
    e.preventDefault();
    const update = await this.props.createAuthor(this.author);
    let { errors } = update.data.createAuthor;
    if (errors && errors.length > 0) {
      errors = errors.map(error => error.message);
      notify.show(errors.join("\n"), "error");
    } else {
      notify.show("Author created", "success");
      this.props.history.push("/admin/authors");
    }
  };

  render() {
    if (this.props.loading) {
      return <Loader />;
    }
    return (
      <StyledSection
        title="Create Author"
        subtitle="Here you can create an author with an appropriate role for your blog"
      >
        <StyledCard>
          <React.Fragment>
            <Basic data={{}} updateOption={this.setOption} />

            <StyledSelect
              bold
              label="Role"
              selected={this.state.selectedRole}
              options={this.props.roles.map(role => {
                return { name: role.name, value: role.id };
              })}
              onChange={this.selectRole}
            />

            <br />
            <br />
            <br />
            <StyledButton success onClick={this.submitData}>
              Create Author
            </StyledButton>
          </React.Fragment>
        </StyledCard>
      </StyledSection>
    );
  }
}

export default CreateAuthorConnector(GetRoles(Create));
