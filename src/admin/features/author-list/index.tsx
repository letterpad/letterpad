import { Author, AuthorsQuery } from "../../../__generated__/gqlTypes";
import React, { useEffect, useState } from "react";
import StyledSection, { SectionSizes } from "../../components/section";
import { WithNamespaces, translate } from "react-i18next";

import { Button } from "../../components/button";
import Loader from "../../components/loader";
import { QUERY_AUTHORS } from "../../../shared/queries/Queries";
import { RouteComponentProps } from "react-router";
import StyledAuthorList from "./AuthorList.css";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";
import apolloClient from "../../../shared/apolloClient";

interface IAuthorListProps extends WithNamespaces {
  router: RouteComponentProps;
}

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
      size={SectionSizes.md}
      title={t("authors.title")}
      rightToolbar={
        <Actions
          newAuthorAction={() => {
            router.history.push("/admin/authors/new");
          }}
        />
      }
    >
      <StyledAuthorList>
        {loading ? (
          <Loader />
        ) : (
          <StyledGrid
            className="author-grid"
            columns="repeat(auto-fill, 200px)"
          >
            {authors &&
              authors.map(author => {
                const authorName = author.name;
                return (
                  <StyledGridItem
                    key={author.email}
                    image={{ src: author.avatar }}
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

const Actions = ({ newAuthorAction }) => {
  return (
    <>
      <Button btnSize="md" btnStyle="primary" onClick={newAuthorAction}>
        New
      </Button>
    </>
  );
};
