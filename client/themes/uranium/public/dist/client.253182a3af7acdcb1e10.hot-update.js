webpackHotUpdate("client/themes/uranium/public/dist/client",{

/***/ "./shared/data-connectors/SinglePageData.js":
/*!**************************************************!*\
  !*** ./shared/data-connectors/SinglePageData.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_apollo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-apollo */ \"./node_modules/react-apollo/react-apollo.browser.umd.js\");\n/* harmony import */ var react_apollo__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_apollo__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _shared_queries_Queries__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/queries/Queries */ \"./shared/queries/Queries.js\");\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(react_apollo__WEBPACK_IMPORTED_MODULE_0__[\"graphql\"])(_shared_queries_Queries__WEBPACK_IMPORTED_MODULE_1__[\"PAGE_MENU\"], {\n    options: props => {\n        return {\n            variables: {\n                slug: props.slug || props.match.params.slug,\n                postType: \"page\"\n            }\n        };\n    },\n    props: ({ data: { loading, pageMenu } }) => ({\n        page: pageMenu ? pageMenu : null,\n        loading\n    })\n}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zaGFyZWQvZGF0YS1jb25uZWN0b3JzL1NpbmdsZVBhZ2VEYXRhLmpzPzM0MjQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFrQjtBQUNFOztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLGFBQWEsUUFBUSxvQkFBb0IsRUFBRTtBQUMzQztBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMiLCJmaWxlIjoiLi9zaGFyZWQvZGF0YS1jb25uZWN0b3JzL1NpbmdsZVBhZ2VEYXRhLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ3JhcGhxbCB9IGZyb20gXCJyZWFjdC1hcG9sbG9cIjtcbmltcG9ydCB7IFBBR0VfTUVOVSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvcXVlcmllcy9RdWVyaWVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGdyYXBocWwoUEFHRV9NRU5VLCB7XG4gICAgb3B0aW9uczogcHJvcHMgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFyaWFibGVzOiB7XG4gICAgICAgICAgICAgICAgc2x1ZzogcHJvcHMuc2x1ZyB8fCBwcm9wcy5tYXRjaC5wYXJhbXMuc2x1ZyxcbiAgICAgICAgICAgICAgICBwb3N0VHlwZTogXCJwYWdlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHByb3BzOiAoeyBkYXRhOiB7IGxvYWRpbmcsIHBhZ2VNZW51IH0gfSkgPT4gKHtcbiAgICAgICAgcGFnZTogcGFnZU1lbnUgPyBwYWdlTWVudSA6IG51bGwsXG4gICAgICAgIGxvYWRpbmdcbiAgICB9KVxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./shared/data-connectors/SinglePageData.js\n");

/***/ })

})