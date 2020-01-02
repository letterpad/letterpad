import React, { useState, useEffect } from "react";
import { notify } from "react-notify-toast";

import Basic from "./Basic";
import Social from "./Social";
import PasswordChange from "./PasswordChange";

import StyledSection from "../../components/section";
import Button from "../../components/button";
import Tabs from "../../components/tabs";

import { RouteComponentProps } from "react-router";
import apolloClient from "../../../shared/apolloClient";
import { UPDATE_AUTHOR } from "../../../shared/queries/Mutations";
import {
  AuthorQuery,
  Author,
  UpdateAuthorMutation,
  InputAuthor,
} from "../../../__generated__/gqlTypes";
import { QUERY_AUTHOR } from "../../../shared/queries/Queries";
import Loader from "../../components/loader";

interface ISettingsProps {
  router: RouteComponentProps;
}

const Author: React.FC<ISettingsProps> = ({ router }) => {
  const urlParams = new URLSearchParams(router.history.location.search);
  const [selectedTab] = useState<string>(urlParams.get("tab") || "basic");

  const [loading, setLoading] = useState<boolean>(true);
  const [author, setAuthor] = useState<Author>();
  const [updatedAuthor, setUpdatedAuthor] = useState<InputAuthor>({ id: 0 });

  const fetchAuthor = async () => {
    const { loading, data } = await apolloClient().query<AuthorQuery>({
      query: QUERY_AUTHOR,
      variables: {
        id: parseInt(router.match.params["id"]),
      },
    });
    const { author } = data;
    if (author) {
      if (author.social) {
        delete author.social.__typename;
      }
      delete author.__typename;
      if (author.role) {
        delete author.role.__typename;
      }
      setAuthor(data.author);
      setUpdatedAuthor({ id: data.author.id || 0 });
    }
    setLoading(loading);
  };

  useEffect(() => {
    fetchAuthor();
  }, []);

  const setOption = (option: string, value: string) => {
    const updated = { ...updatedAuthor, [option]: value };
    setUpdatedAuthor(updated);
  };

  const handleTabChange = (page: string) => {
    router.history.push({
      pathname: router.history.location.pathname,
      search: "?tab=" + page,
    });
  };

  const submitData = async (e: React.MouseEvent) => {
    e.preventDefault();
    await apolloClient(true).mutate<UpdateAuthorMutation>({
      mutation: UPDATE_AUTHOR,
      variables: {
        author: updatedAuthor as InputAuthor,
      },
    });
    notify.show("Author information saved", "success", 3000);
  };

  if (loading || !author) return <Loader />;
  return (
    <StyledSection>
      <Tabs activeTab={selectedTab} onChange={handleTabChange}>
        <Basic label="basic" data={author} updateOption={setOption} />
        <Social label="social" data={author.social} updateOption={setOption} />
        <PasswordChange
          label="passwordChange"
          data={author}
          updateOption={setOption}
        />
        <br />
        <br />
        <Button success onClick={submitData}>
          Save
        </Button>
      </Tabs>
    </StyledSection>
  );
};

export default Author;
