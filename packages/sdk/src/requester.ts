import { LetterpadSdkOptions } from "./letterpad.js";

export function createRequester(options: LetterpadSdkOptions) {
  return async function requester(query: string, variables: any) {
    const response = await fetch(options.letterpadServer.url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${options.letterpadServer.token}`,
        accept: "application/json",
        "content-type": "application/json",
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
