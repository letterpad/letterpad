import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledSection = styled.section`
    background-attachment: fixed;
    position: relative;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    padding: ${props => {
        switch (props) {
            case "sm":
                return "8px";
            case "xs":
                return "16px";
            case "md":
                return "32px";
            default:
                return "16px";
        }
    }};
    .section-header {
        margin-bottom: 36px;
        color: var(--color-text-2);
        font-size: 13px;
        font-weight: 400;
        h2 {
            margin: 20px 0px 10px;
            color: var(--color-text-1);
        }
    }
`;

const Section = ({ children, title, subtitle, ...props }) => {
    return (
        <StyledSection {...props}>
            {title && (
                <div className="section-header">
                    <h2>{title}</h2>
                    {subtitle && <p>{subtitle}</p>}
                </div>
            )}
            {...children}
        </StyledSection>
    );
};

Section.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    title: PropTypes.string,
    subtitle: PropTypes.string
};

export default Section;
