import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import config from "../../../config";
import { GetAuthors } from "../../data-connectors/GetAuthors";
import Loader from "../../components/loader";

import StyledSection from "../../components/section";
import StyledButton from "../../components/button";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";

import StyledAuthorList from "./AuthorList.css";

class Authors extends Component {
  static propTypes = {
    history: PropTypes.object,
    authors: PropTypes.array,
    loading: PropTypes.bool,
    t: PropTypes.func,
  };

  constructor(props) {
    super(props);
    document.body.classList.add("authors-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("authors-page");
  }

  authorSelect = id => {
    this.props.history.push("/admin/authors/edit/" + id);
  };

  render() {
    const { t, loading } = this.props;

    return (
      <StyledSection
        md
        title={t("authors.title")}
        subtitle={t("authors.tagline")}
      >
        <StyledAuthorList>
          <StyledButton
            success
            onClick={() => {
              this.props.history.push("/admin/authors/new");
            }}
            sm
          >
            Add Media
          </StyledButton>
          <br />
          <br />
          {loading ? (
            <Loader />
          ) : (
            <StyledGrid
              className="author-grid"
              columns="repeat(auto-fill, 200px)"
            >
              {this.props.authors.map(author => {
                const authorName = author.fname + " " + author.lname;
                return (
                  <StyledGridItem
                    key={author.email}
                    image={config.baseName + author.avatar}
                    title={authorName}
                    href="#"
                    onClick={() => this.authorSelect(author.id)}
                    line1={author.role.name}
                    // setSelection={this.props.setSelection}
                    // selectedPosts={this.props.selectedPosts}
                  />
                );
              })}
            </StyledGrid>
          )}
        </StyledAuthorList>
      </StyledSection>
    );
  }
}

export default translate("translations")(GetAuthors(Authors));
