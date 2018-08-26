import { css } from "styled-components";

const sizes = {
    xl: 1920,
    lg: 1280,
    md: 960,
    sm: 768,
    xs: 576
};

// Iterate through the sizes and create a media template
export const mediaTemplate = Object.keys(sizes).reduce((acc, label) => {
    acc[label] = (...args) => css`
        @media (max-width: ${sizes[label] / 16}em) {
            ${css(...args)};
        }
    `;

    return acc;
}, {});
