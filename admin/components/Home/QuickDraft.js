import React from "react";
import PropTypes from "prop-types";

const QuickDraft = ({ draftPost }) => {
    return (
        <div className="card">
            <div className="module-title">Quick Draft</div>
            <div className="module-subtitle">Draft a quick post</div>
            <div>
                <div className="form-group">
                    <label className="custom-label">Title</label>
                    <input className="form-control" id="quick-post-title" />
                </div>
                <div className="form-group">
                    <label className="custom-label">Body</label>
                    <textarea
                        id="quick-post-body"
                        rows="2"
                        rowsMax="4"
                        className="form-control"
                        placeholder="Flow your thoughts..."
                    />
                </div>
                <button
                    type="submit"
                    onClick={draftPost}
                    className="btn btn-blue btn-sm"
                >
                    Save Draft
                </button>
            </div>
        </div>
    );
};

QuickDraft.propTypes = {
    draftPost: PropTypes.func
};

export default QuickDraft;
