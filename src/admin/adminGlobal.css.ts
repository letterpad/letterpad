import { darkTheme, lightTheme } from "./css-variables";

import { createGlobalStyle } from "styled-components";

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
    font-size: 86%;
    overflow-x: hidden;
    @media(min-width: 1441px) {
        font-size: 96%;
    }
}

body {
	margin: 0;
    background: var(--bg-base);
    color: var(--color-base);
}


a {
    color: var(--color-base);
    transition: all 0.125s cubic-bezier(0.3, 0.1, 0.58, 1);
    text-decoration: none;
}

a:hover,
a:focus {
    text-decoration: none;
    outline: none;
}
a:hover {
    color: var(--link-hover);
}

::-webkit-input-placeholder {
    color: var(--color-muted) !important;
    font-weight: 300;
}

hr {
    border-top: 1px solid var(--color-border);
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
	font-family: "Inter", sans-serif;
	font-size: 100%;
	line-height: 1.15;
	margin: 0;
    font-size: 1rem;
    
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
export const AdminBaseStyle = createGlobalStyle`

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
        /* font-family: "Roboto", sans-serif; */
        font-family: 'Inter', sans-serif;
        line-height: 1.4;
        font-size: 1rem;
        font-weight: 400;
        -ms-overflow-style: scrollbar;
        overflow-x: hidden;
        overflow-y: auto;
        height: 100%;
        &.theme-dark {
            ${darkTheme}
        }
        &.theme-light {
            ${lightTheme}
        }
        &.no-scroll {
            overflow: hidden;
        }
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
        font-size: 0.95rem;
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
    .theme-dark svg path {
        fill: #fff
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
        font-family: "Inter", sans-serif;
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
        font-size: 0.95rem;
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
            font-size: 0.95rem;
        }
    }
    blockquote {
        font-family: inherit;
        font-style: normal;
        font-size: 1.2rem;
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
    }

    

    body.single {
        main .content-area > div {
            grid-gap: 0px;
        }
    }
    .two-column .content-area {
        width: auto;
        height: auto;
    }
    
    #letterpad-editor-toolbar-toggle-button {
        color: var(--color-base);
        border: 1px solid var(--color-base);
        opacity: 0.7;
    }
    .block-toolbar  {
        .button {
            margin-right: 6px;
        }
        border-radius: 20px;
    }

    [data-id="tooltip"] {
      font-size: 0.8rem;
      text-transform: uppercase;
      padding: 12px 8px !important;
      letter-spacing: 1px;
      font-weight: 500 !important;
      opacity: 1;
    }
    .block-toolbar {
        [data-id="tooltip"] {
            padding: 2px 8px !important;
            font-weight: 500 !important;
            opacity: 1 !important;
            font-family: "Inter", sans-serif;
        }
    }


`;
