import Input, { TextArea } from "../../components/input";
import React, { useRef } from "react";

import { Button } from "../../components/button";
import { CREATE_POST } from "../../../shared/queries/Mutations";
import { CreatePostMutation } from "../../../__generated__/gqlTypes";
import StyledCard from "../../components/card";
import apolloClient from "../../../shared/apolloClient";
import { notify } from "react-notify-toast";
import { translate } from "react-i18next";

interface IQuickDraftProps {
  t: (name: string) => string;
}

const QuickDraft: React.FC<IQuickDraftProps> = ({ t }) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const quickDraftAction = async () => {
    if (!titleRef.current || !bodyRef.current) return;
    if (titleRef.current.value.length > 0) {
      await apolloClient().mutate<CreatePostMutation>({
        mutation: CREATE_POST,
        variables: {
          data: {
            title: titleRef.current.value,
            body: bodyRef.current.value,
          },
        },
      });
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
      <div>
        <Input
          ref={titleRef}
          label={t("home.quickDraft.title")}
          placeholder={t("home.quickDraft.title.placeholder")}
        />
        <TextArea
          ref={bodyRef}
          label={t("home.quickDraft.body")}
          placeholder={t("home.quickDraft.body.placeholder")}
        />
        <Button btnStyle="primary" onClick={() => quickDraftAction()}>
          <i className="fa fa-save" />
          {t("home.quickDraft.save")}
        </Button>
      </div>
    </StyledCard>
  );
};

export default translate("translations")(QuickDraft);
