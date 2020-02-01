import React from "react";
import StyledTabs, { StyledTab } from "./Tabs.css";

interface ITabProps {
  activeTab: string;
  onChange: (name: string) => void;
}

const Tabs: React.FC<ITabProps> = ({ activeTab, onChange, children }) => {
  const onClickTabItem = (e: React.MouseEvent, tab: string) => {
    e.preventDefault();
    onChange(tab);
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
              active={activeTab === label}
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
          if (label && label !== activeTab) return undefined;
          return child;
        })}
      </section>
    </StyledTabs>
  );
};

export default Tabs;
