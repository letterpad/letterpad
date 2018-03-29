import React from "react";
import PropTypes from "prop-types";

const QuickDraft = ({ draftPost }, { t }) => {
    return (
        <div className="card">
            <div className="module-title">{t("home.quickDraft")}</div>
            <div className="module-subtitle">
                {t("home.quickDraft.tagline")}
            </div>
            <div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("home.quickDraft.title")}
                    </label>
                    <input
                        className="form-control"
                        id="quick-post-title"
                        placeholder={t("home.quickDraft.title.placeholder")}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("home.quickDraft.body")}
                    </label>
                    <textarea
                        id="quick-post-body"
                        rows="2"
                        rowsmax="4"
                        className="form-control"
                        placeholder={t("home.quickDraft.body.placeholder")}
                    />
                </div>
                <button
                    type="submit"
                    onClick={draftPost}
                    className="btn btn-blue btn-sm"
                >
                    {t("home.quickDraft.save")}
                </button>
            </div>
        </div>
    );
};

QuickDraft.propTypes = {
    draftPost: PropTypes.func
};
QuickDraft.contextTypes = {
    t: PropTypes.func
};
export default QuickDraft;
