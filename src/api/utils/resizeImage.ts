import sharp from "sharp";

enum ImageType {
  featured_image,
  post_image,
  null,
}

interface IProps {
  type?: ImageType;
  tempPath: string;
  uploadDir: string;
  ext: string;
}

export default async function resizeImage({
  tempPath,
  uploadDir,
  ext,
}: IProps) {
  return new Promise((resolve, reject) => {
    let transform = sharp(tempPath);
    try {
      transform = transform.resize(1200, 1200, {
        withoutEnlargement: true,
        fit: sharp.fit.inside,
      });
      if (ext === "jpg") {
        transform = transform.jpeg({ quality: 80, progressive: true });
      } else if (ext === "png") {
        transform = transform.png({ quality: 80 });
      }
      transform.toFile(uploadDir, err => {
        return err ? reject(err) : resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}
