import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import { Query } from "react-apollo";

import Basic from "./Basic";
import Social from "./Social";
import PasswordChange from "./PasswordChange";

import StyledSection from "../../components/section";
import StyledGrid from "../../components/grid";
import StyledCard from "../../components/card";
import StyledButton from "../../components/button";

import UpdateAuthor from "../../data-connectors/UpdateAuthor";
import Loader from "../../components/loader";
import { GET_AUTHOR } from "../../../shared/queries/Queries";

class EditAuthor extends Component {
  static propTypes = {
    author: PropTypes.object,
    updateAuthor: PropTypes.func,
    loading: PropTypes.bool,
  };

  author = {};

  gridLoaded = element => {
    this.textInput = element;
  };

  componentDidMount() {
    document.body.classList.add("edit-author-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("edit-author-page");
  }

  setOption = (option, value) => {
    this.author[option] = value;
  };

  submitData = async e => {
    e.preventDefault();
    this.author.id = this.props.author.id;
    const update = await this.props.updateAuthor(this.author);
    let { errors } = update.data.updateAuthor;
    if (errors && errors.length > 0) {
      errors = errors.map(error => error.message);
      notify.show(errors.join("\n"), "error");
    } else {
      notify.show("Author updated", "success");
    }
  };

  render() {
    return (
      <Query query={GET_AUTHOR}>
        {({ loading, data }) => {
          if (loading) return <Loader />;
          const { fname, lname } = data.author;
          return (
            <StyledSection
              title={`Edit Author - ${fname} ${lname}`}
              subtitle=""
            >
              <StyledGrid columns="repeat(auto-fit,minmax(300px, 1fr))">
                <StyledCard>
                  <div>
                    <Basic data={data.author} updateOption={this.setOption} />
                    <StyledButton success onClick={this.submitData}>
                      Save
                    </StyledButton>
                  </div>
                </StyledCard>
                <StyledCard>
                  <div>
                    <Social
                      data={data.author.social}
                      updateOption={this.setOption}
                    />
                    <StyledButton success onClick={this.submitData}>
                      Save
                    </StyledButton>
                  </div>
                </StyledCard>
                <StyledCard>
                  <div>
                    <PasswordChange
                      data={data.author}
                      updateOption={this.setOption}
                    />
                    <StyledButton success onClick={this.submitData}>
                      Save
                    </StyledButton>
                  </div>
                </StyledCard>
              </StyledGrid>
            </StyledSection>
          );
        }}
      </Query>
    );
  }
}

export default UpdateAuthor(EditAuthor);
