// const withTM = require("next-transpile-modules")(["ui"]);
const basePath = "/admin";
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: true,
  env: {
    ROOT: __dirname,
    RAYGUN_API_KEY: process.env.RAYGUN_API_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BASE_PATH: process.env.BASE_PATH,
  },
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com",
      "letterpad.app",
      "localhost",
      "picsum.photos",
    ],
  },
  experimental: { images: { allowFutureImage: true } },
  basePath,
  async redirects() {
    return [
      {
        source: "/",
        destination: `/posts`,
        permanent: true,
      },
      {
        source: basePath,
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
};

module.exports = nextConfig;
