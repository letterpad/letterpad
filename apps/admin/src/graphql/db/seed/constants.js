const menu = [
  {
    label: "home",
    original_name: "home",
    slug: "home",
    type: "tag",
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
  site_tagline: "",
  site_email: "admin@letterpad.app",
  site_url: "",
  site_footer: "Powered by Letterpad",
  site_description: "",
  subscribe_embed: "",
  display_author_info: true,
  site_logo: JSON.stringify({
    src: "",
    width: 200,
    height: 200,
  }),
  site_favicon: JSON.stringify({
    src: "https://letterpad.app/uploads/logo.png",
    width: 200,
    height: 200,
  }),
  css: "",
  theme: "minimal",
  menu: JSON.stringify(menu),
  design: JSON.stringify({
    brand_color: "#d93097",
    primary_font: "Inter",
    secondary_font: "Lora",
  }),
  cloudinary_key: "",
  cloudinary_name: "",
  cloudinary_secret: "",
  client_token: "",
  banner: JSON.stringify({
    src: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw1OTQ0NHwwfDF8c2VhcmNofDc4fHxibHVlJTIwd2FsbHBhcGVyfGVufDB8MHx8fDE2NzMyNDEzMjU&ixlib=rb-4.0.3&q=80&w=1080",
  }),
  intro_dismissed: false,
  show_about_page: false,
  show_tags_page: false,
  openai_key: "",
};
