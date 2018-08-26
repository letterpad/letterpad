import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledCard = styled.div`
    padding: 20px;
    border: 1px solid var(--color-border);

    .title {
        line-height: 1.5;
        font-weight: 400;
        font-size: 15px;
        color: var(--color-text-1);
        margin: 0px;
    }
    .subtitle {
        line-height: 1.8;
        font-weight: 300;
    }
`;

const Card = ({ children, title, subtitle, className }) => {
    return (
        <StyledCard className={"card " + className}>
            <h2 className="title">{title}</h2>
            <p className="subtitle">{subtitle}</p>
            {...children}
        </StyledCard>
    );
};

Card.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    className: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string
};

export default Card;
