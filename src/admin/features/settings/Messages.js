import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import Input from "../../components/input";

class Messages extends Component {
  updateOption = (option, value) => {
    this.props.updateOption(option, value);
  };

  render() {
    const { t } = this.props;
    return (
      <div>
        <Input
          label={t("settings.messages.translationNotFound")}
          defaultValue={this.props.data.text_notfound.value}
          type="text"
          onBlur={e => this.updateOption("text_notfound", e.target.value)}
        />
        <Input
          label={t("settings.messages.emptyPost")}
          defaultValue={this.props.data.text_posts_empty.value}
          type="text"
          onBlur={e => this.updateOption("text_posts_empty", e.target.value)}
        />
      </div>
    );
  }
}

Messages.propTypes = {
  data: PropTypes.object,
  updateOption: PropTypes.func,
  t: PropTypes.func,
};

Messages.defaultPropTypes = {
  data: JSON.stringify({
    text_notfound: "",
  }),
};

export default translate("translations")(Messages);
