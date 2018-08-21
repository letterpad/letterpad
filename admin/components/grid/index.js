import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
    /* CSS Grid*/
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 25px;

    /* Media Query for changing grid on bigger screens*/
    /* Bigger than Phones(tablet) */
    @media only screen and (min-width: 750px) and (max-width: 990px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media only screen and (min-width: 991px) and (max-width: 1100px) {
        grid-template-columns: repeat(3, 1fr);
    }
    @media only screen and (min-width: 1101px) and (max-width: 1250px) {
        grid-template-columns: repeat(4, 1fr);
    }
    /* Bigger than Phones(laptop / desktop) */
    @media only screen and (min-width: 1251px) {
        grid-template-columns: repeat(5, 1fr);
    }
`;

const StyledGrid = ({ children, className }) => {
    return <Wrapper className={"grid" + className}>{children}</Wrapper>;
};

StyledGrid.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    className: PropTypes.string
};

export default StyledGrid;
