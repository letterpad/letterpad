import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import styled from "styled-components";
import { notify } from "react-notify-toast";
import Loader from "admin/components/Loader";

import {
    General,
    Social,
    AdditionalSettings,
    Messages
} from "../../components/Settings";
import { GET_OPTIONS } from "../../../shared/queries/Queries";
import UpdateOptions from "../../data-connectors/UpdateOptions";

const Nav = styled.div`
    display: flex;
    margin-bottom: 3rem;
    background: #f5f4f4;
`;

const NavItem = styled.div`
    text-transform: capitalize;
    user-select: none;
    padding: 10px 15px;
    border-bottom: ${p =>
        p.active ? "2px solid black" : "2px solid transparent"};
    cursor: pointer;
    &:hover {
        border-bottom: ${p =>
            p.active ? "2px solid black" : "2px solid rgba(0,0,0, 0.3)"};
    }
`;

const SubmitBtn = ({ handleClick }) => (
    <button type="submit" onClick={handleClick} className="btn btn-blue btn-sm">
        Save
    </button>
);

SubmitBtn.propTypes = {
    handleClick: PropTypes.func
};

const getPageComponent = (selected, data, updateOption) => {
    switch (selected) {
        case "general":
            return <General data={data} updateOption={updateOption} />;
        case "social":
            return <Social data={data} updateOption={updateOption} />;
        case "optional":
            return (
                <AdditionalSettings data={data} updateOption={updateOption} />
            );
        case "messages":
            return <Messages data={data} updateOption={updateOption} />;
        default:
            return null;
    }
};

class Settings extends Component {
    static propTypes = {
        updateOptions: PropTypes.func,
        options: PropTypes.object,
        history: PropTypes.object
    };

    static contextTypes = {
        t: PropTypes.func
    };

    state = {
        updatedOptions: {},
        selected:
            new URLSearchParams(this.props.history.location.search).get(
                "tab"
            ) || "general"
    };

    setOption = (option, value) => {
        const { updatedOptions } = this.state;
        updatedOptions[option] = value;
    };

    submitData = e => {
        e.preventDefault();
        const settings = [];
        Object.keys(this.state.updatedOptions).forEach(option => {
            settings.push({
                option,
                value: this.state.updatedOptions[option]
            });
        });

        this.props.updateOptions(settings).then(() => {
            notify.show("Site settings saved", "success", 3000);
        });
    };

    handleNavClick = (page, e) => {
        e.preventDefault();
        this.props.history.push({
            pathname: this.props.history.location.pathname,
            search: "?tab=" + page
        });
    };

    render() {
        const { selected } = this.state;
        const { options } = this.props;
        const data = {};
        const { t } = this.context;
        if (options.loading) {
            return <Loader />;
        }
        options.settings.forEach(setting => {
            data[setting.option] = setting;
        });

        return (
            <section className="module-xs">
                <div className="card">
                    <Nav>
                        {["general", "social", "optional", "messages"].map(
                            (page, i) => (
                                <NavItem
                                    key={i}
                                    active={selected === page}
                                    onClick={e => this.handleNavClick(page, e)}
                                >
                                    {page}
                                </NavItem>
                            )
                        )}
                    </Nav>
                    <div className="module-title">
                        {t(`settings.${selected}.title`)}
                    </div>
                    <div className="module-subtitle">
                        {t(`settings.${selected}.tagline`)}
                    </div>

                    {getPageComponent(selected, data, this.setOption)}
                    <SubmitBtn handleClick={this.submitData} />
                </div>
            </section>
        );
    }
}

const OptionsData = graphql(GET_OPTIONS, {
    name: "options"
});
export default UpdateOptions(OptionsData(Settings));
