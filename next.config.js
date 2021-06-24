const basePath = "/admin";
const withLess = require("next-with-less");
const path = require("path");

const pathToLessFileWithVariables = path.resolve(
  "node_modules/antd/lib/style/themes/dark.less",
);

module.exports = withLess({
  lessLoaderOptions: {
    // additionalData: (content) =>
    //   `${content}\n\n@import '${pathToLessFileWithVariables}';`,
    lessOptions: {
      modifyVars: {},
      javascriptEnabled: true,
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
  basePath,
  async redirects() {
    return [
      {
        source: "/",
        destination: `${basePath}/posts`,
        permanent: true,
      },
      {
        source: "/admin",
        destination: `${basePath}/posts`,
        permanent: true,
      },
    ];
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [options.defaultLoaders.babel, { loader: "graphql-let/loader" }],
    });

    config.module.rules.push({
      test: /\.graphqls$/,
      exclude: /node_modules/,
      use: ["graphql-let/schema/loader"],
    });

    config.module.rules.push({
      test: /\.ya?ml$/,
      type: "json",
      use: "yaml-loader",
    });

    return config;
  },
});
