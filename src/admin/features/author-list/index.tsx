import React, { useEffect, useState } from "react";
import { translate, WithNamespaces } from "react-i18next";

import config from "../../../config";
import Loader from "../../components/loader";

import StyledSection from "../../components/section";
import StyledButton from "../../components/button";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";
import StyledAuthorList from "./AuthorList.css";
import { QUERY_AUTHORS } from "../../../shared/queries/Queries";
import { RouteComponentProps } from "react-router";
import apolloClient from "../../../shared/apolloClient";
import { AuthorsQuery, Author } from "../../../__generated__/gqlTypes";

interface IAuthorListProps extends WithNamespaces {
  router: RouteComponentProps;
}

// type MayBeAuthors = Author[] | [];

const AuthorList: React.FC<IAuthorListProps> = ({ t, router }) => {
  const [authors, setAuthors] = useState<Author[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const getAuthors = async () => {
    const { data } = await apolloClient().query<AuthorsQuery>({
      query: QUERY_AUTHORS,
    });
    if (data.authors.length > 0) {
      setAuthors(data.authors);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAuthors();
  }, []);

  const authorSelect = (id: number) => {
    router.history.push("/admin/authors/edit/" + id);
  };

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
            router.history.push("/admin/authors/new");
          }}
          sm
        >
          Create Author
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
            {authors &&
              authors.map(author => {
                const authorName = author.fname + " " + author.lname;
                return (
                  <StyledGridItem
                    key={author.email}
                    image={config.baseName + author.avatar}
                    title={authorName}
                    href="#"
                    onClick={() => authorSelect(author.id || 0)}
                    line1={author.role && author.role.name}
                    // setSelection={setSelection}
                    // selectedPosts={selectedPosts}
                  />
                );
              })}
          </StyledGrid>
        )}
      </StyledAuthorList>
    </StyledSection>
  );
};

export default translate("translations")(AuthorList);
