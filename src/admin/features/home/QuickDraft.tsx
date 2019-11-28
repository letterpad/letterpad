import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import StyledCard from "../../components/card";
import StyledInput from "../../components/input";
import StyledButton from "../../components/button";
import { notify } from "react-notify-toast";
import { Mutation } from "react-apollo";
import { CREATE_POST } from "../../../shared/queries/Mutations";

const QuickDraft = ({ t }) => {
  const titleRef = React.createRef();
  const bodyRef = React.createRef();

  const quickDraftAction = createPost => {
    if (titleRef.current.value.length > 0) {
      createPost(titleRef.current.value, bodyRef.current.value);
      notify.show("Draft Saved", "success", 3000);
      titleRef.current.value = "";
      bodyRef.current.value = "";
    }
  };
  return (
    <StyledCard
      title={t("home.quickDraft")}
      subtitle={t("home.quickDraft.tagline")}
    >
      <Mutation mutation={CREATE_POST}>
        {createPost => {
          return (
            <div>
              <StyledInput
                innerRef={titleRef}
                label={t("home.quickDraft.title")}
                id="quick-post-title"
                placeholder={t("home.quickDraft.title.placeholder")}
              />
              <StyledInput
                innerRef={bodyRef}
                label={t("home.quickDraft.body")}
                id="quick-post-body"
                placeholder={t("home.quickDraft.body.placeholder")}
                textarea
                rows="2"
                rowsmax="4"
              />
              <StyledButton
                success
                onClick={() => quickDraftAction(createPost)}
              >
                {t("home.quickDraft.save")}
              </StyledButton>
            </div>
          );
        }}
      </Mutation>
    </StyledCard>
  );
};

QuickDraft.propTypes = {
  draftPost: PropTypes.func,
  t: PropTypes.func,
};

export default translate("translations")(QuickDraft);
