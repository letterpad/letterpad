import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import styled from "styled-components";
import { notify } from "react-notify-toast";

import {
    General,
    Social,
    AdditionalSettings,
    Messages
} from "../../components/Settings";
import { GET_OPTIONS } from "../../../shared/queries/Queries";
import UpdateOptions from "../../data-connectors/UpdateOptions";

const NavWrapper = styled.div`
    margin-bottom: 2rem;
`;

const StyledA = styled.a`
    text-transform: capitalize;
    user-select: none;
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
        case "additional":
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
        options: PropTypes.object
    };

    static contextTypes = {
        t: PropTypes.func
    };

    state = {
        updatedOptions: {},
        selected: "general"
    };

    componentDidMount() {
        document.body.classList.add("settings-page");
        const elem = document.querySelector(".masonry-grid");
        setTimeout(() => {
            new Masonry(elem, {
                itemSelector: ".masonry-grid-item",
                gutter: 10
            });
        }, 300);
    }

    componentWillUnmount() {
        document.body.classList.remove("settings-page");
    }

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

    handleNavClick = page => {
        this.setState({ selected: page });
    };

    render() {
        const { selected } = this.state;
        const { options } = this.props;
        const data = {};
        const { t } = this.context;
        if (options.loading) {
            return <div>hello</div>;
        }
        options.settings.forEach(setting => {
            data[setting.option] = setting;
        });

        return (
            <section className="module-xs">
                <div className="masonry-grid">
                    <div className="card masonry-grid-item">
                        <NavWrapper>
                            <ul className="nav nav-tabs">
                                {[
                                    "general",
                                    "social",
                                    "additional",
                                    "messages"
                                ].map((page, i) => (
                                    <li
                                        key={i}
                                        className={
                                            selected == page ? "active" : ""
                                        }
                                        onClick={e =>
                                            this.handleNavClick(page, e)
                                        }
                                    >
                                        <StyledA>{page}</StyledA>
                                    </li>
                                ))}
                            </ul>
                        </NavWrapper>
                        <div className="module-title">
                            {t(`settings.${selected}.title`)}
                        </div>
                        <div className="module-subtitle">
                            {t(`settings.${selected}.tagline`)}
                        </div>

                        {getPageComponent(selected, data, this.setOption)}
                        <SubmitBtn handleClick={this.submitData} />
                    </div>
                </div>
            </section>
        );
    }
}

const OptionsData = graphql(GET_OPTIONS, {
    name: "options"
});
export default UpdateOptions(OptionsData(Settings));
