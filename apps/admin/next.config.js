// const withTM = require("next-transpile-modules")(["ui"]);
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://eu-assets.i.posthog.com *;
  connect-src https://eu-assets.i.posthog.com *;
  style-src 'unsafe-inline' 'unsafe-eval' *;
  img-src * blob: data:;
  media-src res.cloudinary.com;
  font-src data: *;
  frame-src youtube.com www.youtube.com js.stripe.com;
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
];

/**
 * @type { import("next").NextConfig}
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
  experimental: {
    serverComponentsExternalPackages: ["@whatwg-node"]
  },
  env: {
    ROOT: __dirname,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BASE_PATH: process.env.BASE_PATH,
    NEXT_PUBLIC_ROOT_URL: process.env.ROOT_URL,
    NEXT_PUBLIC_LETTERPAD_PLATFORM: process.env.LETTERPAD_PLATFORM,
  },
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
    ],
  },
  // what is the type of config and options

  /**
   *
   * @param {import("webpack").Configuration} config
   * @param {import("next/dist/next-server/server/config").NextConfig} options
   * @returns {import("webpack").Configuration}
   */
  webpack(config, options) {
    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [options.defaultLoaders.babel, { loader: "graphql-tag/loader" }],
    });

    config.module.rules.push({
      test: /\.ya?ml$/,
      type: "json",
      use: "yaml-loader",
    });

    config.module.rules.push({
      test: /\.graphqls$/,
      exclude: /node_modules/,
      use: ["webpack-graphql-loader"],
    });
    return config;
  },
};

module.exports = nextConfig