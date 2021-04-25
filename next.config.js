module.exports = {
  compress: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  future: {
    webpack5: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/posts",
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
