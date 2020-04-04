import React, { useState, useEffect } from "react";
import { notify } from "react-notify-toast";

import Basic from "./Basic";
import Social from "./Social";
import PasswordChange from "./PasswordChange";

import StyledSection, { SectionSizes } from "../../components/section";

import Tabs from "../../components/tabs";
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
import utils from "../../../shared/util";
import { IAdminRouteProps } from "../../../types/types";

const Author: React.FC<IAdminRouteProps> = ({ router: { match }, author }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authorData, setAuthor] = useState<Author>();
  const [updatedAuthor, setUpdatedAuthor] = useState<InputAuthor>({
    id: parseInt(match.params["id"]),
  });

  useEffect(() => {
    if (Object.keys(updatedAuthor).length > 1) {
      utils.debounce(submitData, 500)();
    }
  }, [updatedAuthor]);

  const fetchAuthor = async id => {
    const { loading, data } = await apolloClient().query<AuthorQuery>({
      query: QUERY_AUTHOR,
      variables: {
        id: id,
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
      setUpdatedAuthor(id);
    }
    setLoading(loading);
  };

  useEffect(() => {
    fetchAuthor(parseInt(match.params["id"]) || author.id);
  }, [match.params["id"] || author.id]);

  const setOption = (option: string, value: string) => {
    if (authorData && authorData[option] === value) return;
    const updated = { ...updatedAuthor, [option]: value };
    setUpdatedAuthor(updated);
  };

  const submitData = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    await apolloClient(true).mutate<UpdateAuthorMutation>({
      mutation: UPDATE_AUTHOR,
      variables: {
        author: updatedAuthor as InputAuthor,
      },
    });
    notify.show("Author information saved", "success", 3000);
  };

  if (loading || !authorData) return <Loader />;
  return (
    <StyledSection title="Profile" size={SectionSizes.md}>
      <Tabs defaultTab="basic">
        <Basic label="basic" data={authorData} updateOption={setOption} />
        <Social
          label="social"
          data={authorData.social}
          updateOption={setOption}
        />
        <PasswordChange
          label="passwordChange"
          data={authorData}
          updateOption={setOption}
        />
        <br />
        <br />
      </Tabs>
    </StyledSection>
  );
};

export default React.memo(Author);
