import Input, { TextArea } from "../../components/input";
import React, { useState } from "react";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";
import { WithNamespaces, translate } from "react-i18next";

import { Container } from "../../components/switch";
import styled from "styled-components";

interface IOptionalProps extends WithNamespaces {
  data: { [option in SettingOptions]: Setting };
  updateOption: (option: SettingOptions, value: string) => void;
  label?: string;
}
const Optional: React.FC<IOptionalProps> = ({ t, data, updateOption }) => {
  const [displayAuthor, setDisplayAuthor] = useState<boolean>(
    JSON.parse(data.displayAuthorInfo.value),
  );

  const changeAuthorDisplay = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayAuthor(e.target.checked);
    updateOption(
      SettingOptions.DisplayAuthorInfo,
      JSON.stringify(e.target.checked),
    );
  };

  return (
    <div>
      <div className="form-group">
        <Container className="switch-block">
          <label className="custom-label">
            {t("settings.additional.displayAuthor")}
          </label>
          &nbsp;&nbsp;&nbsp;
          <label className="switch">
            <input
              type="checkbox"
              onChange={changeAuthorDisplay}
              checked={displayAuthor}
            />
            <span className="slider round" />
          </label>
        </Container>
      </div>
      <br />
      <Input
        label={t("settings.additional.disqus")}
        defaultValue={data.disqus_id.value || ""}
        type="text"
        placeholder={t("settings.additional.disqus.placeholder")}
        onBlur={e => updateOption(SettingOptions.DisqusId, e.target.value)}
      />
      <br />
      <Input
        label={t("settings.additional.cloudinary")}
        defaultValue={data.cloudinary_key.value || ""}
        type="text"
        placeholder={t("settings.additional.cloudinary_key.placeholder")}
        onBlur={e => updateOption(SettingOptions.CloudinaryKey, e.target.value)}
      />
      <br />
      <SubscribeBlock>
        <TextArea
          label={t("settings.additional.subscribe")}
          defaultValue={data.subscribe_embed.value || ""}
          placeholder={t("settings.additional.subscribe.placeholder")}
          rows={15}
          onBlur={e =>
            updateOption(SettingOptions.SubscribeEmbed, e.target.value)
          }
        />
        <small>
          Optional: You may use{" "}
          <u>
            <a href="https://tinyletter.com/" target="_blank">
              TinyLetter
            </a>
          </u>
          to create a free embedable subscription form and send newsletters to
          your subscribers.
        </small>
      </SubscribeBlock>
    </div>
  );
};

export default translate("translations")(Optional);

const SubscribeBlock = styled.div`
  textarea {
    height: auto;
    font-family: monospace;
    font-size: 0.8rem;
    opacity: 0.7;
    border: 1px solid var(--color-border);
    padding: 16px;
  }
`;
