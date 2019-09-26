import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import StyledInput from "../../components/input";
import StyledTitleHeader from "../../components/title-header";

class PasswordChange extends Component {
  static propTypes = {
    updateOption: PropTypes.func,
    t: PropTypes.func,
  };

  updateOption = (option, value) => {
    this.props.updateOption("password", value);
  };

  render() {
    const { t } = this.props;
    return (
      <section>
        <StyledTitleHeader
          title={t("profile.password.title")}
          subtitle={t("profile.password.tagline")}
        />
        <StyledInput
          label={t("profile.password.label")}
          type="password"
          placeholder={t("profile.password.placeholder")}
          onChange={e => this.updateOption("password", e.target.value)}
        />
      </section>
    );
  }
}

export default translate("translations")(PasswordChange);
