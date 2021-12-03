import cheerio from "cheerio";

const groupClass = "gallery";

// Wraps the element <figure> with a div only if <figure> has more siblings
/*
  <p></p>
  <figure>..</figure>
  <figure></figure>
  <p></p>
  <figure></figure>

  The above markup will be converted to 

  <p></p>
  <div class="gallery">
    <figure>..</figure>
    <figure></figure>
  </div>
  <p></p>
  <figure></figure>
*/
export const addGalleryWrapper = (
  htmlStr: string,
  selector: string = "figure.lp-image",
) => {
  const $ = cheerio.load(htmlStr.replace(/\n/, ""));

  let participants = $(selector);

  participants.each((_i, current) => {
    const nextInSource = $(current).next(selector);
    const prevInSource = $(current).prev();

    const nextInSourceIsSibling = nextInSource.length !== 0;
    const hasGroup =
      prevInSource && $(prevInSource).attr("class") === groupClass;

    const isSingle = !hasGroup && !nextInSourceIsSibling;

    if (isSingle) return;

    if (!hasGroup) {
      const group = $('<div class="' + groupClass + '"></div>');
      $(current).wrap(group);
    } else if (prevInSource) {
      $(prevInSource).append(current);
    }
  });
  return $.html();
};
