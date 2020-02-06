const sharp = require("sharp");

export function resizeImage(type, tempImagePath) {
  let transform = sharp(tempImagePath);
  if (type === "featured_image") {
    transform = transform.resize(1200, 800).toBuffer();
  } else if (type === "post_image") {
    transform = transform.jpeg({ quality: 65, progressive: true });
  }
  return transform;
}
module.exports.resizeImage = resizeImage;
