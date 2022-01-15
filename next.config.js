const path = require("path");
const { withSentryConfig } = require("@sentry/nextjs");
const basePath = "/admin";

const isServer = typeof window === "undefined";

const nextConfig = {
  env: {
    RECAPTCHA_KEY_CLIENT: process.env.RECAPTCHA_KEY_CLIENT,
  },
  swcMinify: true,
  experimental: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  compilerOptions: {
    jsxImportSource: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
  gaTrackingId: "UA-120251616-1",
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
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: false, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins

const configWithSentry =
  withSentryConfig && withSentryConfig(nextConfig, sentryWebpackPluginOptions);

let config = !configWithSentry ? nextConfig : configWithSentry;

if (isServer && !process.env.SENTRY_DSN) {
  console.log("Sentry not running");
  config = nextConfig;
}

module.exports = config;
module.exports.basePath = basePath;
