import React, { Component } from "react";
import { notify } from "react-notify-toast";
import { Query } from "react-apollo";

import Basic from "./Basic";
import Social from "./Social";
import PasswordChange from "./PasswordChange";

import StyledSection from "../../components/section";
// import StyledGrid from "../../components/grid";
import StyledCard from "../../components/card";
import StyledButton from "../../components/button";

import Loader from "../../components/loader";
import { QUERY_AUTHOR } from "../../../shared/queries/Queries";
import { translate } from "react-i18next";

class EditAuthor extends Component<any, any> {
  // static propTypes = {
  //   author: PropTypes.object,
  //   updateAuthor: PropTypes.func,
  //   loading: PropTypes.bool,
  // };

  author = { id: parseInt(this.props.router.match.params.id) };

  setOption = (option, value) => {
    this.author[option] = value;
  };

  submitData = async e => {
    e.preventDefault();
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
    const { t } = this.props;
    return (
      <Query query={QUERY_AUTHOR} variables={{ id: this.author.id }}>
        {({ loading, data }) => {
          if (loading) return <Loader />;
          const { fname, lname } = data.author;
          return (
            <StyledSection
              title={`Edit Author - ${fname} ${lname}`}
              subtitle=""
            >
              {/* <StyledGrid columns="repeat(auto-fit,minmax(300px, 1fr))"> */}
              <StyledCard
                title={t("profile.basic.title")}
                subtitle={t("profile.basic.tagline")}
              >
                <div>
                  <Basic data={data.author} updateOption={this.setOption} />
                  <StyledButton success onClick={this.submitData}>
                    Save
                  </StyledButton>
                </div>
              </StyledCard>
              <br />
              <StyledCard
                title={t("social.title")}
                subtitle={t("social.tagline")}
              >
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
              <br />
              <StyledCard
                title={t("profile.password.title")}
                subtitle={t("profile.password.tagline")}
              >
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
              {/* </StyledGrid> */}
            </StyledSection>
          );
        }}
      </Query>
    );
  }
}

export default translate("translations")(EditAuthor);
