import React, { Component } from "react";

import StyledInput from "../../components/input";
import { translate } from "react-i18next";

class PasswordChange extends Component<any, any> {
  // static propTypes = {
  //   updateOption: PropTypes.func,
  //   t: PropTypes.func,
  // };

  updateOption = (option: any, value: any) => {
    this.props.updateOption(option, value);
  };

  render() {
    const { t } = this.props;
    return (
      <section>
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
