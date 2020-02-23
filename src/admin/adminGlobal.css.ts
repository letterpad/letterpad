import { createGlobalStyle } from "styled-components";

export const CssVariables = createGlobalStyle`
html {
    --color-text-primary-invert: #b7b7b7;
    --color-text-primary-light: #616161;
    --color-text-muted: rgb(185, 185, 185);
    --color-text-secondary: #000000;
    --color-text-secondary-light: #4c4c4c;
  
    --color-bg-primary: #27282f;
    --color-bg-secondary: #1f2129;
    --link-hover: #1a82d6;
    --color-bg-content: #fefefe;
    /*change above*/
    --fs-small: 12px;
    --fs-normal: 14px;
    --fs-medium: 16px;
    --fs-large: 18px;
  
    --bg-sections: #fff;
    --bg-base: #f7f7f7;
    --color-border: #e6e6e6;
  
    --color-base: #3d3d3d;
    --color-text-1: #595959;
    --color-text-2: #434141;
    --color-text-3: #7b7b7b;
    --color-muted: #a8a8a8;
  
    --color-accent: 20, 181, 239;
  
    --bg-primary: transparent;
    --color-primary: #333;
    --bg-hover-primary: transparent;
    --color-hover-primary: #111;
  
    --bg-success: #4caf50;
    --color-success: #e8f5e9;
    --bg-hover-success: #43a047;
    --color-hover-success: #fff;
  
    --bg-danger: #e64a19;
    --color-danger: #fbe9e7;
    --bg-hover-danger: #d84315;
    --color-hover-danger: #fff;
  
    --base-shade-9: #212121;
    --base-shade-8: #424242;
    --base-shade-7: #616161;
    --base-shade-6: #757575;
    --base-shade-5: #8e8e8e;
    --base-shade-4: #8e8e8e;
    --base-shade-3: #8e8e8e;
    --base-shade-2: #eeeeee;
    --base-shade-1: #f5f5f5;
  
    --box-shadow: 0 2px 6px rgba(150, 150, 150, 0.26),
      0 0px 6px rgba(210, 210, 210, 0.23);
  
    --box-shadow-inset: inset -1px 3px 9px -3px rgba(0, 0, 0, 0.32);
  }
  
`;

export const NormalizeCss = createGlobalStyle`
     * {
	padding: 0px;
	margin: 0px;
	box-sizing: border-box;
	outline: none;
}
html {
	line-height: 1.15;
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
}
body {
	margin: 0;
}
article,
aside,
footer,
header,
nav,
section {
	display: block;
}
h1 {
	font-size: 2em;
	margin: 0.67em 0;
}
figcaption,
figure,
main {
	display: block;
}
hr {
	box-sizing: content-box;
	height: 0;
	overflow: visible;
	margin-top: 20px;
	margin-bottom: 20px;
	border: 0;
	border-top: 1px solid #cccccc;
}
pre {
	font-family: monospace;
	font-size: 1em;
}
a {
	background-color: transparent;
	-webkit-text-decoration-skip: objects;
}
abbr[title] {
	border-bottom: none;
	text-decoration: underline;
	text-decoration: underline dotted;
}
b,
strong {
	font-weight: inherit;
}
b,
strong {
	font-weight: bold;
}
a {
	text-decoration: none;
}
ul,
ol {
	list-style-type: none;
	padding: 0px;
}
code,
kbd,
samp {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
	font-size: 1em;
}
dfn {
	font-style: italic;
}
mark {
	background-color: #ff0;
	color: #000;
}
small {
	font-size: 80%;
}
sub,
sup {
	font-size: 75%;
	line-height: 0;
	position: relative;
	vertical-align: baseline;
}
sub {
	bottom: -0.25em;
}
sup {
	top: -0.5em;
}
audio,
video {
	display: inline-block;
}
audio:not([controls]) {
	display: none;
	height: 0;
}
img {
	border-style: none;
}
svg:not(:root) {
	overflow: hidden;
}
button,
input,
optgroup,
select,
textarea {
	font-family: sans-serif;
	font-size: 100%;
	line-height: 1.15;
	margin: 0;
}
button,
input {
	overflow: visible;
}
button,
select {
	text-transform: none;
}
button,
html[type="button"],
[type="reset"],
[type="submit"] {
	-webkit-appearance: button;
}
button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
	border-style: none;
	padding: 0;
}
button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
	outline: 1px dotted ButtonText;
}
fieldset {
	padding: 0.35em 0.75em 0.625em;
}
legend {
	box-sizing: border-box;
	color: inherit;
	display: table;
	max-width: 100%;
	padding: 0;
	white-space: normal;
}
progress {
	display: inline-block;
	vertical-align: baseline;
}
textarea {
	overflow: auto;
}
[type="checkbox"],
[type="radio"] {
	box-sizing: border-box;
	padding: 0;
}
[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
	height: auto;
}
[type="search"] {
	-webkit-appearance: textfield;
	outline-offset: -2px;
}
[type="search"]::-webkit-search-cancel-button,
[type="search"]::-webkit-search-decoration {
	-webkit-appearance: none;
}
::-webkit-file-upload-button {
	-webkit-appearance: button;
	font: inherit;
}
details,
menu {
	display: block;
}
summary {
	display: list-item;
}
canvas {
	display: inline-block;
}
template {
	display: none;
}
[hidden] {
	display: none;
}
`;
export const AdminBaseStyle = createGlobalStyle`@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900");
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:100,300,400,500,600,700");
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700");

/*! -----------------------------------------------------------------
    [Master Stylesheet]

    Project:     Ajaxtown
    Version:     1.0
    Last change: 21/03/2017
    Primary use: Blog

    ------------------------------------------------------------------
    [General Styles]
    */

    html {
        height: 100%;
    }
    body {
        font-family: "Roboto", sans-serif;
        line-height: 1.4;
        font-size: 14px;
        font-weight: 400;
        -ms-overflow-style: scrollbar;
        overflow-x: hidden;
        overflow-y: auto;
        height: 100%;
    }
    img {
        max-width: 100%;
    }
    iframe {
        border: 0;
    }
    [contenteditable="true"]:empty:before {
        content: attr(placeholder);
        display: block;
        color: #ccc;
        cursor: pointer;
        /* For Firefox */
    }
    input,
    textarea,
    [contenteditable="true"]:focus {
        outline: none;
    }
    input[type="search"]::-webkit-search-cancel-button {
        -webkit-appearance: searchfield-cancel-button;
    }
    .table {
        tbody tr td:first-child, thead tr th:first-child {
            padding-left: 16px !important;
        }
    }
    ::-webkit-input-placeholder {
        color: var(--color-text-muted) !important;
        font-weight: 300;
    }
    .top-head {
        display: none;
    }
    .home .top-head {
        display: block;
    }
    .container-fluid {
        padding: 0 24px;
    }
    .listing {
        line-height: 30px;
    }
    .pointer {
        cursor: pointer;
    }
    .fa {
        position: relative !important;
    }
    .fs-small {
        font-size: 12px;
    }
    .fs-normal {
        font-size: 14px;
    }
    .fs-medium {
        font-size: 16px;
    }
    .fs-large {
        font-size: 18px;
    }
    .hide {
        display: none;
    }
    /*!------------------------------------------------------------------
        [Typography]
        */

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: "Roboto Condensed", sans-serif;
        letter-spacing: 1px;
        font-weight: 400;
        margin: 24px 0 20px;
    }
    h1 {
        font-size: 30px;
    }
    h2 {
        font-size: 26px;
    }
    h3 {
        font-size: 20px;
    }
    h4 {
        font-size: 18px;
    }
    h5 {
        font-size: 16px;
    }
    h6 {
        font-size: 14px;
    }
    p,
    ul,
    ol {
        margin: 0 0 10px;
    }
    pre {
        border: 0;
        line-height: 1.9;
        font-size: 13px;
        padding: 35px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        -o-border-radius: 2px;
        border-radius: 2px;
        code {
            font-family: inherit;
            font-size: 14px;
        }
    }
    blockquote {
        font-family: inherit;
        font-style: normal;
        font-size: 16px;
        text-align: left;
        border-left: 4px solid var(--color-accent);
        padding: 2px 8px;
    }
    blockquote cite {
        display: block;
        font-size: 17px;
        color: #bbb;
        margin: 30px 0;
    }
    .lead {
        line-height: 1.8;
        font-size: 18px;
    }
    .font-alt {
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .font-serif {
        font-family: Georgia, sans-serif;
        font-style: italic;
    }
    .text-light {
        color: #fff !important;
    }
    .text-light h1,
    .text-light h2,
    .text-light h3,
    .text-light h4,
    .text-light h5,
    .text-light h6 {
        color: #fff !important;
    }
    .text-light a {
        color: rgba(255, 255, 255, 0.7);
    }
    .text-light a:hover {
        color: #fff;
    }
    /*--------------------------------------
        [TopBar]
        */

    .user-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        .avatar {
            width: 25px;
            height: 25px;
            border-radius: 100%;
        }
    }
    @media screen and (max-width: 991px) {
        .top-bar {
            width: 100%;
            margin-top: 71px;
            position: absolute;
        }
    }
    /*!------------------------------------------------------------------
        [Forms]
        */

    .form-control {
        border: 0;
        height: 36px;
        padding: 13px 0px;
        font-size: var(--fs-normal);
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text-secondary)-light;
        border-radius: 0px;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        -o-box-shadow: none;
        box-shadow: none;
        transition: 0.3s border-color linear;
        text-transform: none;
        background: transparent;
    }
    .form-control[disabled] {
        background: transparent;
        color: var(--color-text-primary)-light;
    }
    .form-control:focus {
        box-shadow: 0px 1px 0px 0px #66afe9;
    }
    .comments-form .control-label {
        font-weight: 400;
        font-size: 12px;
        color: #bbb;
    }
    /*!------------------------------------------------------------------
        [Notification Messages]
        */

    #notification-wrapper {
        font-size: var(--fs-normal);
    }
    /*!------------------------------------------------------------------
        [Modules]
        */

    .module,
    .module-sm,
    .module-xs {
        background-attachment: fixed;
        padding: 140px 0;
        position: relative;
        background-repeat: no-repeat;
        background-position: center center;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
    }
    .module-sm {
        padding: 70px 0;
    }
    .module-xs {
        padding: 16px 0;
        margin: 0 16px;
    }
    .module-title {
        line-height: 1.4;
        font-weight: 400;
        font-size: 15px;
        color: var(--color-text-secondary);
        text-transform: uppercase;
    }
    .module-subtitle {
        font-family: "Roboto", sans-serif;
        line-height: 1.8;
        font-weight: 300;
        font-size: 13px;
        color: var(--color-text-primary)-light;
    }
    .module-title,
    .module-subtitle {
        margin: 0 0 16px;
    }
    .module-title+.module-subtitle {
        margin-top: -16px;
    }
    .divider {
        border-color: #f5f5f5;
        margin: 0;
    }
    .to-top-link {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 40px;
        height: 40px;
        background: #f5f5f5;
        text-align: center;
        line-height: 40px;
        margin-left: -20px;
    }
    .to-top-link:hover {
        background: #111;
        color: #fff;
    }
    .loader {
        margin: 0 0 2em;
        height: 100px;
        width: 20%;
        text-align: center;
        padding: 1em;
        margin: 0 auto 1em;
        display: inline-block;
        vertical-align: top;
    }
    
    .modal-open {
        overflow: hidden;
    }
    .hide {
        display: none !important;
    }
`;

export const AdminGlobalStyle = createGlobalStyle`
    header {
        grid-area: header;
    }

    nav {
        grid-area: nav;
    }

    main {
        grid-area: content;
        margin-top: 60px;
    }

    body {
        .main {
            display: grid;
            grid-template-areas:
            "header header"
            "nav content"
            "footer footer";
            grid-template-columns: 200px 1fr;
            grid-template-rows: auto 1fr auto;
        }

        .collapsed {
            nav,
            main {
                transform: translateX(-200px);
                .content-area {
                    width: 100vw;
                }
            }
        }

        @media (max-width: 767px) {
            .content-area {
            width: 100vw;
            }
        }
        @media (max-width: 991px) {
            .main {
                grid-template-columns: 200px 1fr;
            }
        }
    }

    body.single {
        main .content-area > div {
            grid-gap: 0px;
        }
    }
    .content-area {
        overflow: auto;
        overflow-x: hidden;
        min-height: 100%;
    }
    body.posts {
        .content-area > div {
            display: grid;
            grid-template-columns: auto auto auto;
            grid-gap: 12px;
        }
        @media (max-width: 991px) {
            .content-area > div {
                grid-template-columns: auto auto;
            }
        }
        @media (max-width: 768px) {
            .content-area > div {
                grid-template-columns: auto;
            }
        }
    }
    @media (max-width: 768px) {
        .content-area > .module-xs {
            margin: 0px;
        }
    }
`;
