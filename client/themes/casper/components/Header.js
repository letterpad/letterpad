import React, { Component } from "react";
import MenuHorizontal from "../components/Navbar/MenuHorizontal";

const HeaderContent = ({ props }) => {
    return (
        <div className="site-header-content">
            <h1 className="site-title">{props.settings.site_title.value}</h1>
            <h2 className="site-description">
                {props.settings.site_tagline.value}
            </h2>
        </div>
    );
};
const Navigation = ({ props }) => {
    return (
        <nav className="site-nav">
            <div className={"site-nav-left " + props.navClass}>
                <MenuHorizontal
                    ref="secondaryMenuItems"
                    secondary={true}
                    items={JSON.parse(props.settings.menu.value)}
                    router={props.router}
                />
            </div>
            <div className="site-nav-right">
                <a className="search-button" href="/search">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 1792 1792"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1216 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z"
                            fill="#fff"
                        />
                    </svg>
                </a>
                <a className="rss-button" href="" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <circle cx="6.18" cy="17.82" r="2.18" />
                        <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
                    </svg>
                </a>
            </div>
        </nav>
    );
};
class Header extends Component {
    render() {
        const styles = {
            hero: {
                backgroundImage: `url(${this.props.settings.banner.value})`
            }
        };
        return (
            <header className="site-header outer" style={styles.hero}>
                <div className="inner">
                    {this.props.showBg && <HeaderContent props={this.props} />}
                    <Navigation props={this.props} />
                </div>
            </header>
        );
    }
}
export default Header;
