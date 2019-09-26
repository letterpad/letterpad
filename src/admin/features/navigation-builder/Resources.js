import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import styled from "styled-components";

const StyledResources = styled.div`
  h5 {
    margin-bottom: 8px;
    font-size: 13px;
  }
  .list-group {
    max-height: 200px;
    overflow-y: auto;
    width: 300px;
    padding-left: 0;
    margin-bottom: 20px;
    .list-group-item {
      background: var(--bg-sections);
      border: 1px solid var(--color-border);
      cursor: pointer;
      &[disabled] {
        opacity: 0.3;
        cursor: not-allowed;
      }
      &:first-child {
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
      }
      &:last-child {
        margin-bottom: 0;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      position: relative;
      display: block;
      padding: 10px 15px;
      margin-bottom: -1px;
    }
  }
`;

const Resources = ({ title, data, itemClicked, t }) => {
  return (
    <StyledResources>
      <h5>{t(`menu.${title}`)}</h5>
      <ul className="list-group resources">
        {data.map((item, i) => {
          const disabled = item.disabled ? { disabled: true } : {};
          return (
            <li
              className="list-group-item"
              key={i}
              onClick={() => !item.disabled && itemClicked(i)}
              {...disabled}
            >
              {item.title}
            </li>
          );
        })}
      </ul>
    </StyledResources>
  );
};

Resources.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      url: PropTypes.string,
    }),
  ),
  itemClicked: PropTypes.func,
  t: PropTypes.func,
};

export default translate("translations")(Resources);
