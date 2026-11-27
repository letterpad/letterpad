/**
 * Connect to Letterpad's MCP data endpoint. This module also runs without the
 * generated GraphQL client so the standalone MCP container can ship by itself.
 */
export function createLetterpadMcpClient(dataUrl, authorization) {
  const endpoint = new URL(dataUrl);
  if (
    !["https:", "http:"].includes(endpoint.protocol) ||
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash
  ) {
    throw new Error(
      "Set LETTERPAD_MCP_DATA_URL to the Letterpad MCP data endpoint.",
    );
  }

  async function request(url, init) {
    let response;
    try {
      response = await fetch(url, {
        ...init,
        redirect: "error",
        signal: AbortSignal.timeout(60_000),
      });
    } catch {
      throw new Error("Could not connect to Letterpad.");
    }
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      if (
        typeof result?.error === "string" &&
        (
          response.status < 500 ||
          result.error.startsWith("Image storage failed:")
        )
      ) {
        throw Object.assign(new Error(result.error), {
          status: response.status,
        });
      }
      throw new Error("Letterpad could not complete the request.");
    }
    if (!result) throw new Error("Letterpad returned an invalid response.");
    return result;
  }

  function read(op, params, headers) {
    const url = new URL(endpoint);
    url.searchParams.set("op", op);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    return request(url, { headers });
  }

  function requireAuthorization() {
    if (
      typeof authorization !== "string" ||
      !/^Bearer [^\s]+$/i.test(authorization)
    ) {
      throw new Error(
        "Create a token in Letterpad Settings → Keys and configure it in your MCP client.",
      );
    }
    return authorization;
  }

  function readPrivate(op, params) {
    return read(op, params, { authorization: requireAuthorization() });
  }

  function write(op, args) {
    return request(endpoint, {
      method: "POST",
      headers: {
        authorization: requireAuthorization(),
        "content-type": "application/json",
      },
      body: JSON.stringify({ ...args, op }),
    });
  }

  return {
    listMyPosts: (params) => readPrivate("list-my-posts", params),
    getMyPost: (params) => readPrivate("get-my-post", params),
    listMyDrafts: (params) => readPrivate("list-drafts", params),
    getMyDraft: (params) => readPrivate("get-draft", params),
    getMyBlogSettings: () => readPrivate("get-settings", {}),
    updateMyBlogSettings: (args) => write("update-settings", args),
    createDraft: (args) => write("create", args),
    updateDraft: (args) => write("update", args),
    updateMyPost: (args) => write("update-post", args),
    publishMyDraft: (args) => write("publish", args),
    uploadImage: (args) => write("upload", args),
    uploadImageFile: (filename, file) =>
      request(endpoint, {
        method: "PUT",
        headers: {
          authorization: requireAuthorization(),
          "content-type": "application/octet-stream",
          "x-letterpad-filename": filename,
        },
        body: file,
      }),
  };
}
