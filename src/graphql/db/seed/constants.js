const menu = [
  {
    label: "home",
    original_name: "home",
    slug: "first-post",
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
  VERIFY_NEW_USER: "{{ company_name }} - Verify Email",
  FORGOT_PASSWORD: "{{ company_name }} - Reset your password",
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
  display_author_info: true,
  site_logo: JSON.stringify({
    src: "/uploads/logo.png",
    width: 200,
    height: 200,
  }),
  site_favicon: JSON.stringify({
    src: "/uploads/logo.png",
    width: 200,
    height: 200,
  }),
  css: "",
  google_analytics: "UA-120251616-1",
  theme: "minimal",
  menu: JSON.stringify(menu),
  cloudinary_key: "",
  cloudinary_name: "",
  cloudinary_secret: "",
  client_token: "",
  banner: JSON.stringify({}),
  intro_dismissed: false,
};
