import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import config from "../../../config";
import Loader from "../../components/loader";

import StyledSection from "../../components/section";
import StyledButton from "../../components/button";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";
import StyledAuthorList from "./AuthorList.css";
import { Query } from "react-apollo";
import { GET_AUTHORS } from "../../../shared/queries/Queries";

class Authors extends Component {
  static propTypes = {
    router: PropTypes.object,
    authors: PropTypes.array,
    loading: PropTypes.bool,
    t: PropTypes.func,
  };

  componentDidMount() {
    document.body.classList.add("authors-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("authors-page");
  }

  authorSelect = id => {
    this.props.router.history.push("/admin/authors/edit/" + id);
  };

  render() {
    const { t } = this.props;

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
              this.props.router.history.push("/admin/authors/new");
            }}
            sm
          >
            Add Media
          </StyledButton>
          <br />
          <br />
          <Query query={GET_AUTHORS}>
            {({ loading, data }) => {
              if (loading) return <Loader />;
              return (
                <StyledGrid
                  className="author-grid"
                  columns="repeat(auto-fill, 200px)"
                >
                  {data.authors.map(author => {
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
              );
            }}
          </Query>
        </StyledAuthorList>
      </StyledSection>
    );
  }
}

export default translate("translations")(Authors);
