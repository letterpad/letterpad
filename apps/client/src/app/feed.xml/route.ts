import { NextApiRequest, NextApiResponse } from 'next';

import { getFeed } from '../../data';

export async function GET(_req: NextApiRequest, res: NextApiResponse) {
  try {
    // Replace this with your actual data retrieval logic
    const { feedResponse, settings, me } = await getFeed();

    // Generate the XML feed
    const xmlData = generateXmlFeed(feedResponse.rows, {
      title: settings.site_title,
      desciption: settings.site_description,
    });

    const headers = new Headers({
      'Content-Type': 'application/xml',
    });

    return new Response(xmlData, {
      status: 200,
      headers,
    });
  } catch (error) {
    throw error;
  }
}

function generateXmlFeed(rows, options) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<rss version="2.0">';
  xml += '<channel>';
  xml += `<title>${options.title}</title>`;
  xml += `<description>${options.description}</description>`;

  rows.forEach((item) => {
    xml += '<item>';
    xml += `<guid>${item.guid}</guid>`;
    xml += `<title>${item.title}</title>`;
    xml += `<link>${item.link}</link>`;
    xml += `<description>${item.description}</description>`;
    xml += `<pubDate>${item.pubDate}</pubDate>`;
    xml += `<author>${item.author}</author>`;
    xml += '<categories>';
    item.categories.forEach((category) => {
      xml += `<category>${category}</category>`;
    });
    xml += '</categories>';
    xml += '</item>';
  });

  xml += '</channel>';
  xml += '</rss>';

  return xml;
}
