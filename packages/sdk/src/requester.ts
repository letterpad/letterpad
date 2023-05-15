import { LetterpadSdkOptions } from "./letterpad.js";
import fetch from "cross-fetch";

export function createRequester(options: LetterpadSdkOptions) {
  return async function requester(query: string, variables: any) {
    const response = await fetch(options.letterpadServer.url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${options.letterpadServer.token}`,
        accept: "application/json",
        "content-type": "application/json",
        identifier: options.letterpadServer.host
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    const body = await response.json();
    return body.data;
  };
}
