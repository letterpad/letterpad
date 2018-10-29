import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import Input from "../../components/input";

class Social extends Component {
  updateOption = (option, value) => {
    this.props.updateOption(option, value);
  };

  render() {
    const { t } = this.props;
    return (
      <div>
        <Input
          label={t("common.github")}
          defaultValue={this.props.data.social_github.value}
          type="text"
          placeholder={t("social.gh.placeholder")}
          onBlur={e => this.updateOption("social_github", e.target.value)}
        />

        <Input
          label={t("common.facebook")}
          defaultValue={this.props.data.social_facebook.value}
          type="text"
          placeholder={t("social.fb.placeholder")}
          aria-invalid="false"
          onBlur={e => this.updateOption("social_facebook", e.target.value)}
        />

        <Input
          label={t("common.twitter")}
          defaultValue={this.props.data.social_twitter.value}
          type="text"
          placeholder={t("social.twitter.placeholder")}
          onBlur={e => this.updateOption("social_twitter", e.target.value)}
        />

        <Input
          label={t("common.instagram")}
          defaultValue={this.props.data.social_instagram.value}
          type="text"
          placeholder={t("social.ig.placeholder")}
          onBlur={e => this.updateOption("social_instagram", e.target.value)}
        />
      </div>
    );
  }
}

Social.propTypes = {
  data: PropTypes.object,
  updateOption: PropTypes.func,
  t: PropTypes.func,
};

Social.defaultPropTypes = {
  data: JSON.stringify({
    social_twitter: "",
    social_instagram: "",
    social_facebook: "",
    social_github: "",
  }),
};

export default translate("translations")(Social);
