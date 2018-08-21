import React from "react";

export const cloneElement = (children, props) => {
    if (children && !children.length) {
        children = [children];
    }

    return (
        children &&
        children.reduce((result, child, index) => {
            if (child) {
                result.push(
                    React.cloneElement(child, {
                        ...props,
                        key: index
                    })
                );
            }

            return result;
        }, [])
    );
};
