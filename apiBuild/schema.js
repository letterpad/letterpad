"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _graphqlTools = require("graphql-tools");

var GraphQLTools = _interopRequireWildcard(_graphqlTools);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)((0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "./schema")));

var resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)((0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "./resolvers")));

/*  generate executable GraphQL schema  */
var schema = GraphQLTools.makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
    allowUndefinedInResolve: false,
    printErrors: true,
    resolverValidationOptions: {
        requireResolversForArgs: true,
        requireResolversForNonScalar: false,
        requireResolversForAllFields: false
    }
});

var _default = schema;
exports.default = _default;
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(typeDefs, "typeDefs", "api/schema.js");
    reactHotLoader.register(resolvers, "resolvers", "api/schema.js");
    reactHotLoader.register(schema, "schema", "api/schema.js");
    reactHotLoader.register(_default, "default", "api/schema.js");
    leaveModule(module);
})();

;