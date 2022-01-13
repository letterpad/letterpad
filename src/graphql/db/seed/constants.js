const menu = [
  {
    label: "home",
    original_name: "home",
    slug: "home",
    type: "tag",
  },
  {
    label: "Page",
    original_name: "Page",
    slug: "letterpad-typography",
    type: "page",
  },
];

/**
 * Keep this file in commonjs format. It is being used in migrations which are in commonjs.
 */

module.exports.subjects = {
  VERIFY_NEW_USER: "{{ blog_name }} - Verify Email",
  FORGOT_PASSWORD: "{{ blog_name }} - Reset your password",
  VERIFY_NEW_SUBSCRIBER: "{{ blog_name }} - Verify your email",
  NEW_POST: "{{ blog_name }} - New Post",
};

module.exports.defaultSettings = {
  site_title: "Letterpad",
  site_tagline: "Compose a story",
  site_email: "admin@letterpad.app",
  site_url: "https://demo.letterpad.app",
  site_footer: "",
  site_description: "",
  subscribe_embed: "",
  social_twitter: "",
  social_facebook: "",
  social_instagram: "",
  social_github: "",
  displayAuthorInfo: true,
  site_logo: {
    src: "/uploads/logo.png",
    width: 200,
    height: 200,
  },
  site_favicon: {
    src: "/uploads/logo.png",
    width: 200,
    height: 200,
  },
  css: "",
  google_analytics: "UA-120251616-1",
  theme: "hugo",
  menu: menu,
  cloudinary_key: "",
  cloudinary_name: "",
  cloudinary_secret: "",
  client_token: "",
  banner: {
    src: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80",
    width: 1502,
    height: 900,
  },
};
