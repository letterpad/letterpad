import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
    .item-image {
        height: 150px;
        img {
            height: 100%;
            width: 100%;
            object-fit: cover;
            border-radius: 8px;
            background: var(--bg-sections);
            &:hover {
                opacity: 0.5;
            }
        }
        .item-sticky {
            position: absolute;
            padding: 2px 12px;
            background: rgba(var(--color-accent), 0.7);
            border-radius: 8px;
            border-top-right-radius: 0px;
            border-bottom-left-radius: 0px;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 11px;
            color: var(--color-text-1);
        }
    }
    .item-meta {
        color: var(--color-text-3);
        font-size: 12px;
        p.line1 {
            color: var(--color-text-2);
            margin-bottom: 20px;
        }
        p {
            line-height: 1.3;
        }
    }
    h2.item-title {
        font-size: 13px;
        color: var(--color-text-2);
        height: 36px;
        margin-bottom: 10px;
        line-height: 1.4;
    }
`;

const StyledGrid = ({
    title,
    image,
    line1,
    line2,
    stickyText,
    className,
    href,
    onClick
}) => {
    return (
        <Link to={href} onClick={onClick}>
            <Wrapper className={"grid-item " + className}>
                <div className="item-image">
                    {stickyText && <p className="item-sticky">{stickyText}</p>}
                    <img src={image} />
                </div>
                <h2 className="item-title">{title}</h2>
                <div className="item-meta">
                    {line1 && <p className="line1">{line1}</p>}
                    {line2 && <p className="line2">{line2}</p>}
                </div>
            </Wrapper>
        </Link>
    );
};

StyledGrid.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    stickyText: PropTypes.string,
    image: PropTypes.string,
    line1: PropTypes.string,
    line2: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func
};

export default StyledGrid;
