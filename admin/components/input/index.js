import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
    input,
    textarea {
        border: 0px;
        border-bottom: 1px solid var(--color-border);
        padding: 13px 0px;
        font-size: 14px;
        border-radius: 0px;
        box-shadow: none;
        transition: 0.3s border-color linear;
        background: transparent;
        display: block;
        width: 100%;
        line-height: 1.42857143;
        height: 36px;
    }
    textarea {
        height: auto;
    }
`;

const StyledInput = ({ label, textarea, innerRef, ...props }) => {
    return (
        <Wrapper className="form-group">
            <label className="custom-label">{label}</label>
            {textarea ? (
                <textarea ref={innerRef} {...props} />
            ) : (
                <input ref={innerRef} {...props} />
            )}
        </Wrapper>
    );
};

StyledInput.propTypes = {
    label: PropTypes.string,
    textarea: PropTypes.bool,
    innerRef: PropTypes.object
};

export default StyledInput;
