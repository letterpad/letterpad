const path = require("path");
const basePath = "/admin";

const isServer = typeof window === "undefined";

const nextConfig = {
  productionBrowserSourceMaps: true,
  env: {
    ROOT: __dirname,
    RAYGUN_API_KEY: process.env.RAYGUN_API_KEY,
  },
  swcMinify: true,
  compilerOptions: {
    jsxImportSource: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com"],
  },
  gaTrackingId: "UA-120251616-1",
  basePath,
  async redirects() {
    return [
      {
        source: "/",
        destination: `/posts`,
        permanent: true,
      },
      {
        source: "/admin",
        destination: `/posts`,
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
  webpackDevMiddleware: (config) => {
    return config;
  },
};

module.exports = nextConfig;
module.exports.basePath = basePath;
