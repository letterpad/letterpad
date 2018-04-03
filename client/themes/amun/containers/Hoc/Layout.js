import React, { Component } from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import MenuVertical from "../../components/Navbar/MenuVertical";
import Search from "../../components/Sidebar/Search";

require("../../public/pcss/client.pcss");

var styles1 = {
    bmBurgerButton: {
        position: "fixed",
        width: "16px",
        height: "15px",
        left: "22px",
        top: "18px"
    },
    bmBurgerBars: {
        background: "#000",
        height: "2px"
    },
    bmCrossButton: {
        height: "24px",
        width: "24px"
    },
    bmCross: {
        background: "#bdc3c7"
    },
    bmMenu: {
        background: "rgb(255, 255, 255)",
        padding: "2.5em 1.5em 0",
        fontSize: "1.15em"
    },
    bmMorphShape: {
        fill: "#373a47"
    },
    bmItemList: {
        color: "#b8b7ad",
        padding: "0.8em"
    },
    bmOverlay: {
        background: "rgba(0, 0, 0, 0.3)"
    }
};
export default function Layout(Element, props, name) {
    const settings = props.settings;
    const layout = settings.layout_display.value;

    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                image: settings.banner.value,
                title: settings.site_title.value,
                subTitle: settings.site_tagline.value
            };
            this.setHeroDetails = this.setHeroDetails.bind(this);
        }
        setHeroDetails(data) {
            if (["Home", "Posts"].indexOf(name) >= 0) {
                this.setState(data);
            } else {
                this.setState(data);
            }
        }
        render() {
            const _props = { ...this.props, ...props, settings };
            const styles = {
                hero: {
                    backgroundImage: `url(${this.state.image})`
                }
            };
            return (
                <div className="main centered" id="outerid">
                    <nav className="navbar navbar-custom">
                        <Menu
                            outerContainerId="outerId"
                            width={280}
                            styles={styles1}
                        >
                            <MenuVertical
                                menu={JSON.parse(_props.settings.menu.value)}
                                router={this.props}
                            />
                        </Menu>
                        <Link to="/">
                            <h1 className="site_title">
                                {_props.settings.site_title.value}
                            </h1>
                        </Link>
                        {/*<Search {...this.props} />*/}
                    </nav>
                    <header style={styles.hero} className="hero">
                        <div className="site-header-content">
                            <h1 className="site-title">{this.state.title}</h1>
                            <h2 className="site-description">
                                {this.state.subTitle}
                            </h2>
                        </div>
                    </header>
                    <main>
                        <Element
                            {..._props}
                            setHeroDetails={this.setHeroDetails}
                        />
                    </main>
                </div>
            );
        }
    };
}
