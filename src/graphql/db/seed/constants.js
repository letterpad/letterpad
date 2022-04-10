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
  VerifyNewUser: "{{ company_name }} - Verify Email",
  VERIFY_EMAIL_CHANGE: "{{ company_name }} - Email Change Verification",
  ForgotPassword: "{{ company_name }} - Reset your password",
  VerifySubscriber: "{{ blog_name }} - Verify your email",
  NewPost: "{{ blog_name }} - New Post",
};

module.exports.defaultSettings = {
  site_title: "Letterpad",
  site_tagline: "My space",
  site_email: "admin@letterpad.app",
  site_url: "",
  site_footer: "Letterpad is an open source project licensed under MIT.",
  site_description: "Use this space to describe your blog.",
  subscribe_embed: "",
  social_twitter: "",
  social_facebook: "",
  social_instagram: "",
  social_github: "",
  display_author_info: true,
  site_logo: JSON.stringify({
    src: "https://letterpad.app/admin/uploads/logo.png",
    width: 200,
    height: 200,
  }),
  site_favicon: JSON.stringify({
    src: "https://letterpad.app/admin/uploads/logo.png",
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
  show_about_page: true,
  show_tags_page: true,
};
