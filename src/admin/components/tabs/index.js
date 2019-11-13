import React, { Component } from "react";
import PropTypes from "prop-types";
import StyledTabs, { StyledTab } from "./Tabs.css";

class Tabs extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
    onChange: PropTypes.func,
    activeTab: PropTypes.string,
  };

  onClickTabItem = (e, tab) => {
    e.preventDefault();
    this.props.onChange(tab);
  };

  render() {
    const {
      onClickTabItem,
      props: { children, activeTab },
    } = this;

    return (
      <StyledTabs>
        <div className="tab-header">
          {children.map(child => {
            const { label } = child.props;
            if (!label) return null;
            console.log("activeTab === label :", activeTab, label);
            return (
              <StyledTab
                className="tab-item"
                key={label}
                active={activeTab === label}
                onClick={e => onClickTabItem(e, label)}
              >
                {label}
              </StyledTab>
            );
          })}
        </div>
        <section className="tab-content">
          {children.map(child => {
            const { label } = child.props;
            if (label && label !== activeTab) return undefined;
            return child;
          })}
        </section>
      </StyledTabs>
    );
  }
}

export default Tabs;
