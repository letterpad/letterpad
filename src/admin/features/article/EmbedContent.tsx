import Embed from "./Embed";
import React from "react";
import ReactDOM from "react-dom";
import embeds from "./embeds";

const regex = /<a[^>]+href=\"(.*?)\"[^>]*>(.*?)<\/a>/gi;

export default async function convertLinksToEmbed(html: string) {
  const htmlWithEmbedContent = await replaceAsync(
    html,
    regex,
    async (match, url: string) => {
      return await getEmbedHtml(match, url);
    },
  );

  return htmlWithEmbedContent;
}

async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

async function getEmbed(node) {
  var iframeHolder = document.createElement("div");
  document.body.appendChild(iframeHolder);
  return new Promise(resolve => {
    ReactDOM.render(
      <Embed
        node={node}
        getContent={(instance, attrs, content = "") => {
          const iframe = instance;
          iframe.id = Date.now().toString();
          // the contents of the below div will be executed by javascript and then the div will be removed
          const executionDiv = `
                <div class="execute">
                  var iframe = document.getElementById("${iframe.id}");
                  var doc = iframe.document;
                  if (iframe.contentDocument) doc = iframe.contentDocument;
                  else if (iframe.contentWindow) doc = iframe.contentWindow.document;
                  doc.open();
                  doc.writeln(decodeURI('${encodeURI(content)}'));
                  doc.close();
                </div>
            `;
          // we execute the div by loading a 1px image and hooking up with the onload method.
          // `makeMeRun` is a special method that is set in the theme template which looks for div with classname
          // `execute` and runs them
          const blankImage = `<img style="visibility:hidden;width:0px;margin:0px;" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" onload="makeMeRun()">`;
          const embedContent =
            iframeHolder.innerHTML + (content ? executionDiv + blankImage : "");
          document.body.removeChild(iframeHolder);
          return resolve(embedContent);
        }}
      />,
      iframeHolder,
    );
  });
}

async function getEmbedHtml(anchorTag: string, url: string) {
  const keys = Object.keys(embeds);
  const node = {
    data: {
      get: () => url,
    },
  };

  for (const key of keys) {
    const component = embeds[key];

    for (const host of component.ENABLED) {
      const matches = url.match(host);
      if (matches) {
        return await getEmbed(node);
      }
    }
  }

  return Promise.resolve(anchorTag);
}
