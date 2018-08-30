import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import StyledLink from "../link";

const Wrapper = styled.div`
    text-align: center;
    ul {
        display: inline-block;
        padding: 0;
        margin: 28px 0;

        li {
            display: inline;
            a {
                border-right: 1px solid var(--color-border);
                background: var(--bg-sections);
                padding: 8px 14px;
                font-weight: 400;
                &.active,
                &:hover {
                    background: rgba(var(--color-accent));
                }
            }
            &:first-child a {
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
            }
            &:last-child a {
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                border-right: none;
            }
        }
    }
`;

const StyledPagination = ({ count, limit, page, changePage }) => {
    const pages = Array.from(Array(Math.ceil(count / limit)));
    if (pages.length === 1) return null;
    const pageItems = pages.map((_, i) => {
        const num = i + 1;
        const active = num === page ? "active" : "";
        return (
            <li key={i}>
                <StyledLink
                    className={active}
                    onClick={e => changePage(e, num)}
                    to="#"
                >
                    {num}
                </StyledLink>
            </li>
        );
    });
    return (
        <Wrapper className="pagination-wrapper">
            <ul className="pagination">{pageItems}</ul>
        </Wrapper>
    );
};

StyledPagination.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    className: PropTypes.string,
    count: PropTypes.number,
    page: PropTypes.number,
    limit: PropTypes.number,
    changePage: PropTypes.func
};

export default StyledPagination;
