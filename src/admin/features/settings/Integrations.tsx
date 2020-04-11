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
const Integrations: React.FC<IOptionalProps> = ({ t, data, updateOption }) => {
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
      <p>
        <b>Cloudinary - </b>Enter cloudinary credentials to take advantage of
        their CDN. You can register a free account at cloudinary.com All the
        below details can be found from the dashboard.
      </p>
      <Input
        label={t("settings.cdn.cloud_name")}
        defaultValue={data.cloudinary_name.value || ""}
        type="text"
        placeholder={t("settings.cdn.cloud_name.placeholder")}
        onBlur={e =>
          updateOption(SettingOptions.CloudinaryName, e.target.value)
        }
      />
      <Input
        label={t("settings.cdn.cloudinary_key")}
        defaultValue={data.cloudinary_key.value || ""}
        type="text"
        placeholder={t("settings.cdn.cloudinary_key.placeholder")}
        onBlur={e => updateOption(SettingOptions.CloudinaryKey, e.target.value)}
      />
      <Input
        label={t("settings.cdn.cloudinary_secret")}
        defaultValue={data.cloudinary_secret.value || ""}
        type="text"
        placeholder={t("settings.cdn.cloudinary_secret.placeholder")}
        onBlur={e =>
          updateOption(SettingOptions.CloudinarySecret, e.target.value)
        }
      />
      <br />
      <p>
        <b>Disqus - </b>Use Disqus for to enable comments on your website.
        Anyone with a disqus account can comment and this service is free to
        use.
      </p>
      <Input
        label={t("settings.additional.disqus")}
        defaultValue={data.disqus_id.value || ""}
        type="text"
        placeholder={t("settings.additional.disqus.placeholder")}
        onBlur={e => updateOption(SettingOptions.DisqusId, e.target.value)}
      />
      <br />
      <p>
        <b>Mailchimp & Email Subscriptions - </b>Integrate with mailchimp or
        other email subscription providers. Enter the subscription HTML below.
      </p>
      <SubscribeBlock>
        <TextArea
          label={t("settings.additional.subscribe")}
          defaultValue={data.subscribe_embed.value || ""}
          placeholder={t("settings.additional.subscribe.placeholder")}
          rows={5}
          onBlur={e =>
            updateOption(SettingOptions.SubscribeEmbed, e.target.value)
          }
        />
        <small>
          Optional: You may use{" "}
          <u>
            <a href="https://tinyletter.com/" target="_blank">
              TinyLetter{" "}
            </a>
          </u>
          to create a free embedable subscription form and send newsletters to
          your subscribers.
        </small>
      </SubscribeBlock>
    </div>
  );
};

export default translate("translations")(Integrations);

const SubscribeBlock = styled.div`
  textarea {
    height: auto;
    font-family: monospace;

    opacity: 0.7;
    border: 1px solid var(--color-border);
    padding: 16px;
  }
`;
