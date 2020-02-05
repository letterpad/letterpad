import React from "react";
import styled from "styled-components";

const StyledHero = styled.div`
    margin: -16px -33px 33px;
    img {
        max-height: 600px;
        object-fit: cover;
    }
    @media screen and (max-width: 800px) {
        display: none;
    }
`;

const HeroImage = ({ image, display }) => {
    if (!display) return null;
    return (
        <StyledHero className="hero-banner">
            <img width="100%" src={image} />
        </StyledHero>
    );
};

export default HeroImage;
