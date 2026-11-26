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
      if (response.status < 500 && typeof result?.error === "string") {
        throw Object.assign(new Error(result.error), {
          status: response.status,
        });
      }
      throw new Error("Letterpad could not complete the request.");
    }
    if (!result) throw new Error("Letterpad returned an invalid response.");
    return result;
  }

  function read(op, params) {
    const url = new URL(endpoint);
    url.searchParams.set("op", op);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    return request(url);
  }

  function requireAuthorization() {
    if (
      typeof authorization !== "string" ||
      !/^Bearer [^\s]+$/i.test(authorization)
    ) {
      throw new Error(
        "Configure the Letterpad bearer token in your MCP client.",
      );
    }
    return authorization;
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
    listPublishedPosts: (params) => read("list", params),
    getPublishedPost: (params) => read("get", params),
    createDraft: (args) => write("create", args),
    updateDraft: (args) => write("update", args),
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
