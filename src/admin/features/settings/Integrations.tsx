import Input, { TextArea } from "../../components/input";
import React, { useState } from "react";
import { WithNamespaces, translate } from "react-i18next";

import { Setting } from "../../../__generated__/gqlTypes";
import { UpdateSettingOption } from "../../../types/types";
import styled from "styled-components";

interface IOptionalProps extends WithNamespaces {
  data: Setting;
  updateOption: (setting: UpdateSettingOption) => void;
  label?: string;
}
const Integrations: React.FC<IOptionalProps> = ({ t, data, updateOption }) => {
  const [displayAuthor, setDisplayAuthor] = useState<boolean>(
    JSON.parse(data.displayAuthorInfo),
  );

  const changeAuthorDisplay = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayAuthor(e.target.checked);
    updateOption({ displayAuthorInfo: JSON.stringify(e.target.checked) });
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
        defaultValue={data.cloudinary_name || ""}
        type="text"
        placeholder={t("settings.cdn.cloud_name.placeholder")}
        onBlur={e => updateOption({ cloudinary_name: e.target.value })}
      />
      <Input
        label={t("settings.cdn.cloudinary_key")}
        defaultValue={data.cloudinary_key || ""}
        type="text"
        placeholder={t("settings.cdn.cloudinary_key.placeholder")}
        onBlur={e => updateOption({ cloudinary_key: e.target.value })}
      />
      <Input
        label={t("settings.cdn.cloudinary_secret")}
        defaultValue={data.cloudinary_secret || ""}
        type="text"
        placeholder={t("settings.cdn.cloudinary_secret.placeholder")}
        onBlur={e => updateOption({ cloudinary_secret: e.target.value })}
      />
      <br />
      <p>
        <b>Disqus - </b>Use Disqus for to enable comments on your website.
        Anyone with a disqus account can comment and this service is free to
        use.
      </p>
      <Input
        label={t("settings.additional.disqus")}
        defaultValue={data.disqus_id || ""}
        type="text"
        placeholder={t("settings.additional.disqus.placeholder")}
        onBlur={e => updateOption({ disqus_id: e.target.value })}
      />
      <br />
      <p>
        <b>Mailchimp & Email Subscriptions - </b>Integrate with mailchimp or
        other email subscription providers. Enter the subscription HTML below.
      </p>
      <SubscribeBlock>
        <TextArea
          label={t("settings.additional.subscribe")}
          defaultValue={data.subscribe_embed || ""}
          placeholder={t("settings.additional.subscribe.placeholder")}
          rows={5}
          onBlur={e => updateOption({ subscribe_embed: e.target.value })}
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
