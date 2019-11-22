import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import { translate } from "react-i18next";

import General from "./General";
import Social from "./Social";
import Optional from "./Optional";
import Messages from "./Messages";

import StyledSection from "../../components/section";
import StyledTitleHeader from "../../components/title-header";
import Button from "../../components/button";
import Tabs from "../../components/tabs";

import UpdateOptions from "../../data-connectors/UpdateOptions";
import Themes from "./Themes";
import Css from "./Css";

class Settings extends Component {
  static propTypes = {
    updateOptions: PropTypes.func,
    options: PropTypes.object,
    settings: PropTypes.object,
    router: PropTypes.object,
    t: PropTypes.func,
  };

  state = {
    updatedOptions: {},
    selected:
      new URLSearchParams(this.props.router.history.location.search).get(
        "tab",
      ) || "general",
  };

  setOption = (option, value) => {
    const { updatedOptions } = this.state;
    updatedOptions[option] = value;
  };

  submitData = e => {
    e.preventDefault();
    const settings = [];
    Object.keys(this.state.updatedOptions).forEach(option => {
      settings.push({
        option,
        value: this.state.updatedOptions[option],
      });
    });

    this.props.updateOptions(settings).then(() => {
      notify.show("Site settings saved", "success", 3000);
    });
  };

  handleNavClick = page => {
    this.props.router.history.push({
      pathname: this.props.router.history.location.pathname,
      search: "?tab=" + page,
    });
  };

  render() {
    const { selected } = this.state;
    const { settings, t } = this.props;

    return (
      <StyledSection>
        <Tabs activeTab={selected} onChange={this.handleNavClick}>
          <StyledTitleHeader
            title={t(`settings.${selected}.title`)}
            subtitle={t(`settings.${selected}.tagline`)}
          />

          <General
            label="general"
            data={settings}
            updateOption={this.setOption}
          />
          <Social
            label="social"
            data={settings}
            updateOption={this.setOption}
          />
          <Optional
            label="optional"
            data={settings}
            updateOption={this.setOption}
          />
          <Themes
            label="themes"
            settings={settings}
            updateOption={this.setOption}
          />
          <Css label="css" settings={settings} updateOption={this.setOption} />
          <Messages
            label="messages"
            data={settings}
            updateOption={this.setOption}
          />
          <br />
          <br />
          <Button success onClick={this.submitData}>
            Save
          </Button>
        </Tabs>
      </StyledSection>
    );
  }
}

export default translate("translations")(UpdateOptions(Settings));
