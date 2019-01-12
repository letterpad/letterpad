import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";

import UpdateOptions from "../../data-connectors/UpdateOptions";
import SettingsData from "shared/data-connectors/SettingsData";
import { makeUrl } from "shared/util";
import ThemeItem from "./ThemeItem";

import StyledSection from "../../components/section";
import StyledGrid from "../../components/grid";
import StyledCard from "../../components/card";
import StyledInput from "../../components/input";
import StyledButton from "../../components/button";

let SCROLLTOP = 0;

class Themes extends Component {
  static propTypes = {
    updateOptions: PropTypes.func,
    options: PropTypes.object,
    settings: PropTypes.object
  };

  cssRef = React.createRef();

  state = {
    css: "",
    themes: [],
    loading: true,
    theme: "",
  };

  updatedOptions = {};

  componentDidMount() {
    this.setState({ loading: true }, this.getThemes);
    document.body.classList.add("themes-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("themes-page");
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.settings.loading) {
      return false;
    }
    const { data } = nextProps.settings;
    const { css, theme } = data;

    return {
      css: nextState.css || css.value,
      theme: theme.value,
    };
  }

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    if (typeof window === "undefined") return null;
    if (prevState.loading) return null;
    SCROLLTOP = window.scrollY;
    return null;
  };

  componentDidUpdate() {
    if (typeof window === "undefined") return null;
    window.scrollTo(0, SCROLLTOP);
  }

  getThemes = () => {
    const url = makeUrl("/admin/getThemes");
    fetch(url, { headers: { Authorization: localStorage.token } })
      .then(res => res.json())
      .then(themes => {
        this.setState({ themes, loading: false });
      });
  };

  handleCssChange = e => {
    const newState = { css: e.target.value };
    this.setState(newState);
  };

  setOption = (option, value) => {
    this.updatedOptions[option] = value;
  };

  activateTheme = async e => {
    e && e.preventDefault();
    const settings = [];
    Object.keys(this.updatedOptions).forEach(option => {
      let value = this.updatedOptions[option];
      settings.push({
        option,
        value,
      });
    });
    await this.props.updateOptions(settings);
    notify.show("Theme Activated", "success", 3000);
  };

  selectTheme = (e, theme) => {
    e.preventDefault();
    if (e.target.className == "material-icons") return;
    const modifiedThemes = this.state.themes.map(items => {
      items.active = false;
      if (theme.name === items.name) {
        items.active = true;
      }
      return items;
    });
    this.updatedOptions.theme = theme.short_name;
    this.setState(
      {
        themes: modifiedThemes,
      },
      () => {
        this.activateTheme();
      },
    );
  };

  saveCss = async e => {
    e.preventDefault();
    await this.props.updateOptions([{ option: "css", value: this.state.css }]);
    notify.show("CSS Saved", "success", 3000);
  };

  render() {
    return (
      <StyledSection>
        <div>
          <StyledCard
            title="Custom CSS"
            subtitle="Here you can write additional css to customize the theme. (optional)"
          >
            <StyledInput
              textarea
              rows="7"
              value={this.state.css}
              placeholder="Additional CSS"
              onChange={this.handleCssChange}
              ref={this.cssRef}
            />
            <StyledButton onClick={this.saveCss}>Save</StyledButton>
          </StyledCard>
          <br />
          <StyledCard title="Select Theme" subtitle="Browse your themes here">
            <div>
              <StyledGrid columns="repeat(auto-fit,minmax(250px,1fr))">
                {this.state.themes.map((theme, idx) => (
                  <ThemeItem
                    key={idx}
                    theme={theme}
                    selectTheme={this.selectTheme}
                  />
                ))}
              </StyledGrid>
            </div>
          </StyledCard>
        </div>
      </StyledSection>
    );
  }
}

export default SettingsData(UpdateOptions(Themes));
