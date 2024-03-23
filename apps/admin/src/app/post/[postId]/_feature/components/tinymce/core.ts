if (typeof window !== "undefined") {
  require("tinymce/tinymce");
  require("tinymce/models/dom");
  require("tinymce/themes/silver/theme.js");
  require("tinymce/plugins/advlist");
  require("tinymce/plugins/autolink");
  require("tinymce/plugins/lists");
  require("tinymce/plugins/link");
  require("tinymce/plugins/anchor");
  require("tinymce/plugins/searchreplace");
  require("tinymce/plugins/code");
  require("tinymce/plugins/wordcount");
  require("tinymce/plugins/quickbars");
  require("tinymce/plugins/autoresize");
  require("tinymce/plugins/codesample");
  require("tinymce/plugins/directionality");
  require("../plugins/ai");
  require("../plugins/image");
  require("../plugins/latex");
  // require("tinymce/plugins/image");
  require("../plugins/editImage");
  require("tinymce/plugins/pagebreak");
  require("tinymce/icons/default");
  require("tinymce/skins/ui/oxide-dark/skin.min.css");
  require("tinymce/skins/ui/oxide-dark/content.min.css");
}
export {};
