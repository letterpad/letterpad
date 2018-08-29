import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import StyledCard from "../../components/card";
import StyledInput from "../../components/input";
import StyledButton from "../../components/button";

const QuickDraft = ({ draftPost, t }) => {
    return (
        <StyledCard
            title={t("home.quickDraft")}
            subtitle={t("home.quickDraft.tagline")}
        >
            <div>
                <StyledInput
                    label={t("home.quickDraft.title")}
                    id="quick-post-title"
                    placeholder={t("home.quickDraft.title.placeholder")}
                />
                <StyledInput
                    label={t("home.quickDraft.body")}
                    id="quick-post-body"
                    placeholder={t("home.quickDraft.body.placeholder")}
                    textarea
                    rows="2"
                    rowsmax="4"
                />
                <StyledButton success onClick={draftPost}>
                    {t("home.quickDraft.save")}
                </StyledButton>
            </div>
        </StyledCard>
    );
};

QuickDraft.propTypes = {
    draftPost: PropTypes.func,
    t: PropTypes.func
};

export default translate("translations")(QuickDraft);
