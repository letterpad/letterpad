module.exports = {
  compress: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
  future: {
    webpack5: true,
  },
  basePath: "/admin",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin/posts",
        permanent: true,
      },
      {
        source: "/admin",
        destination: "/admin/posts",
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
