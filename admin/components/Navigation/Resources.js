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
        .list-group-item[disabled] {
            background: #eee;
        }
        border: 1px solid #e6e5e5;
        max-height: 200px;
        overflow-y: auto;
        box-shadow: 0 0 10px 0 #f0f0f0;
        width: 300px;
        .list-group-item {
            border-left: none;
            border-right: none;
            cursor: pointer;
            &[disabled] {
                opacity: 0.5;
                cursor: not-allowed;
            }
            &:first-child {
                border-top: none;
            }
            &:last-child {
                border-bottom: none;
            }
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
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
                .isRequired,
            title: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            url: PropTypes.string
        })
    ),
    itemClicked: PropTypes.func,
    t: PropTypes.func
};

export default translate("translations")(Resources);
