import React, { Component } from "react";
import styled from "styled-components";

const StyledProgress = styled.div`
    height: 6px;
    margin-bottom: 20px;
    overflow: hidden;
    background-color: #f5f5f5;
    margin: -16px -20px 0px -33px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);

    @-webkit-keyframes progress-bar-stripes {
        from {
            background-position: 40px 0;
        }
        to {
            background-position: 0 0;
        }
    }
    @keyframes progress-bar-stripes {
        from {
            background-position: 40px 0;
        }
        to {
            background-position: 0 0;
        }
    }

    .progress-bar-striped {
        width: 100%;
        float: left;
        width: 100%;
        height: 100%;
        font-size: 12px;
        line-height: 20px;
        color: #fff;
        text-align: center;
        background-color: #337ab7;
        box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
        transition: width 0.6s ease;

        background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
        );
        background-size: 40px 40px;
        animation: progress-bar-stripes 2s linear infinite;
    }
`;
export default class Loader extends Component {
    render() {
        return (
            <StyledProgress>
                <div className="progress-bar-striped" />
            </StyledProgress>
        );
    }
}
