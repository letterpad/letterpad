import fetch from "cross-fetch";

export const submitSitemap = async (sitemapUrl: string) => {
  if (!sitemapUrl) return false;
  try {
    const sitemapUrlParam = encodeURIComponent(sitemapUrl);
    const googleSubmitUrl =
      "https://www.google.com/ping?sitemap=" + sitemapUrlParam;
    const bingAndYahooSubmitUrl =
      "https://www.bing.com/ping?sitemap=" + sitemapUrlParam;

    await fetch(googleSubmitUrl);
    await fetch(bingAndYahooSubmitUrl);
  } catch (e) {
    console.log(e);
  }
};
