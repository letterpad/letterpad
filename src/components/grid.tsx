import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const Grid = ({ images, actions, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(200);

  useEffect(() => {
    handleResize();
  }, [ref.current]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    if (ref.current) {
      const node = ref.current.firstChild;
      if (node) {
        //@ts-ignore
        setWidth(node.clientWidth);
      }
    }
  };

  return (
    <>
      <div className="grid" ref={ref}>
        {images.map((image, index) => {
          image = getDimensions({ ...image }, width - 20);
          return (
            <div className="image-item">
              <Image
                {...image}
                src={image.url}
                loading="lazy"
                alt="kkkk"
                onClick={() => onClick && onClick(index)}
              />
              {actions && actions(index)}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .grid {
          display: grid;
          grid-gap: 10px;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          grid-auto-rows: minmax(50px, auto);
        }
        .image-item {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          background: rgb(var(--content-bg));
          flex-direction: column;
        }
      `}</style>
    </>
  );
};

function getDimensions(image, availableWidth: number) {
  const aspectRatio = image.width / image.height;
  image.width = availableWidth;
  image.height = availableWidth / aspectRatio;

  while (image.height > availableWidth) {
    image.width -= 1;
    image.height -= 1;
  }

  return image;
}
