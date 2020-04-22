import React, { useState, useEffect } from "react";
import { notify } from "react-notify-toast";

import Basic from "./Basic";
import Social from "./Social";
import PasswordChange from "./PasswordChange";

import StyledSection, { SectionSizes } from "../../components/section";
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
import Accordion from "../../components/accordion";
import { translate, WithNamespaces } from "react-i18next";

const Author: React.FC<IAdminRouteProps & WithNamespaces> = ({
  t,
  router: { match },
  author,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authorData, setAuthor] = useState<Author>();
  const [updatedAuthor, setUpdatedAuthor] = useState<InputAuthor>({
    id: parseInt(match.params["id"]),
  });

  useEffect(() => {
    // updatedAuthor will always have the id. If there are more keys, then we will update.
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
    const updated = {
      ...updatedAuthor,
      [option]: value,
      id: (authorData as Author).id as number,
    };
    setUpdatedAuthor(updated);
  };

  const submitData = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const { data } = await apolloClient(true).mutate<UpdateAuthorMutation>({
      mutation: UPDATE_AUTHOR,
      variables: {
        author: updatedAuthor as InputAuthor,
      },
    });
    if (data && data.updateAuthor) {
      const { errors } = data.updateAuthor;
      if (errors && errors.length > 0) {
        return notify.show(
          errors.map(err => err.message).join("<br/>"),
          "error",
          3000,
        );
      }
    }
  };

  if (loading || !authorData) return <Loader />;
  return (
    <StyledSection title="Profile" size={SectionSizes.md}>
      <Accordion
        title={t("profile.basic.title")}
        subtitle={t("profile.basic.tagline")}
        tab="general"
      >
        <Basic data={authorData} updateOption={setOption} />
      </Accordion>
      <Accordion
        title={t("social.title")}
        subtitle={t("social.tagline")}
        tab="social"
      >
        <Social data={authorData.social} updateOption={setOption} />
      </Accordion>

      <Accordion
        title={t("profile.password.title")}
        subtitle={t("profile.password.tagline")}
        tab="passwordChange"
      >
        <PasswordChange data={authorData} updateOption={setOption} />
      </Accordion>
    </StyledSection>
  );
};

export default React.memo(translate("translations")(Author));
