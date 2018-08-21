import styled from "styled-components";

export default styled.div`
    position: relative;

    &.open > .dropdown-menu {
        display: block;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        display: none;
        float: left;
        min-width: 160px;
        padding: 5px 0;
        margin: 2px 0 0;
        font-size: 14px;
        text-align: left;
        list-style: none;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ccc;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);

        padding: 20px;
        max-height: 90vh;
        overflow-y: auto;
        &.publish {
            width: 340px;
            margin-left: -190px;
        }
        &.meta {
            width: 320px;
            margin-left: -240px;
        }
    }
`;
