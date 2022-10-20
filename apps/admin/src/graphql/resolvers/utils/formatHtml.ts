import { load } from "cheerio";

import { setImageWidthAndHeightInHtml } from "../helpers";

export async function formatHtml(html: string) {
  const $ = load(html, {
    xmlMode: true,
    decodeEntities: false,
    //@ts-ignore
    normalizeWhitespace: false,
  });
  // remove all tooltips which are used for grammar checking
  $("[data-tippy-root]").remove();
  $("[data-mce-bogus='all']").remove();
  $("head").remove();
  $(".mark").each(function () {
    // remove all decorations caused by grammar
    $(this).replaceWith($(this).text());
  });

  html = $.html();

  const _html = await setImageWidthAndHeightInHtml(html);
  if (_html) {
    html = _html;
  }

  return html;
}
