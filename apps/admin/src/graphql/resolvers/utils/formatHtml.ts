import { load } from "cheerio";

import { setImageWidthAndHeightInHtml } from "../helpers";

export async function formatHtml(html: string) {
  const $ = load(html, {
    xmlMode: true,
    decodeEntities: false,
    //@ts-ignore
    normalizeWhitespace: false,
  });
  $("[data-mce-bogus='all']").remove();
  $("head").remove();

  html = $.html();

  const _html = await setImageWidthAndHeightInHtml(html);
  if (_html) {
    html = _html;
  }

  return html.replaceAll("</img>", "");
}
