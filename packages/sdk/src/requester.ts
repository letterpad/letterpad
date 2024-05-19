import { LetterpadSdkOptions } from "./letterpad.js";

export function createRequester(options: LetterpadSdkOptions) {
  return async function requester(query: string, variables: any) {
    try {
      const response = await fetch(options.letterpadServer.url, {
        method: "POST",
        headers: {
          authorization: `Bearer ${options.letterpadServer.token}`,
          accept: "application/json",
          "content-type": "application/json",
          identifier: options.letterpadServer.host,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });
      const body = await response.json();
      if (body.errors) {
        console.log("Requester failed", body.errors);
        throw new Error("There was a graphql error while contacting the server.");
      }
      return body.data;
    } catch (e) {
      // print more info
      console.log("Server URL", options.letterpadServer.url);
      console.log("Server Token", options.letterpadServer.token);
      console.log("Server Host", options.letterpadServer.host);

      console.log(`Exception - Requester failed`, e);
    }
  };
}
