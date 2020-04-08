import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import StyledTabs, { StyledTab } from "./Tabs.css";

interface ITabProps extends RouteComponentProps {
  defaultTab: string;
}

const Tabs: React.FC<ITabProps> = ({ defaultTab, children, history }) => {
  const [selectedTab, changeTab] = useState<string>(defaultTab);

  useEffect(() => {
    const urlParams = new URLSearchParams(history.location.search);
    changeTab(urlParams.get("tab") || defaultTab);
  }, [document.location.search]);

  const onClickTabItem = (e: React.MouseEvent, tab: string) => {
    e.preventDefault();
    history.push({
      pathname: history.location.pathname,
      search: "?tab=" + tab,
    });
  };

  return (
    <StyledTabs>
      <div className="tab-header">
        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) return;
          const { label } = child.props;
          if (!label) return null;
          return (
            <StyledTab
              className="tab-item"
              key={label}
              active={selectedTab === label}
              onClick={(e: React.MouseEvent) => onClickTabItem(e, label)}
            >
              {label}
            </StyledTab>
          );
        })}
      </div>
      <section className="tab-content">
        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) return;
          const { label } = child.props;
          if (label && label !== selectedTab) return undefined;
          return child;
        })}
      </section>
    </StyledTabs>
  );
};

export default withRouter(Tabs);
