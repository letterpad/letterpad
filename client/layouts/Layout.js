import React, { Component } from "react";
import FullWidthLayout from "./FullWidthLayout";
import CenteredLayout from "./CenteredLayout";
import PostsData from "../data-supply/PostsData";

export default function Layout(Element, props) {
    const layout = props.settings.layout_display.value;

    const r = () => {
        switch (layout) {
            case "centered":
                return <CenteredLayout component={<Element {...props} />} />;
            case "two-column":
                return <FullWidthLayout component={<Element {...props} />} />;
        }
    };

    return r;

    // return () => {

    // };
}
