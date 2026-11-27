import { getServerSession } from "@/graphql/context";
import {
  canIssueMcpToken,
  issueMcpToken,
  listMcpTokens,
  revokeMcpToken,
} from "@/lib/mcpTokens";
import { getRootUrl } from "@/shared/getRootUrl";
import logger from "@/shared/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

class TokenRequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

async function withAuthor(
  request: Request,
  action: (authorId: string) => Promise<{ body: unknown; status?: number }>
) {
  const headers = { "Cache-Control": "no-store" };
  try {
    if (process.env.LETTERPAD_MCP_ENABLED !== "true") {
      throw new TokenRequestError("Not found.", 404);
    }
    if (
      request.method !== "GET" &&
      request.headers.get("origin") !== new URL(getRootUrl()).origin
    ) {
      throw new TokenRequestError(
        "Open the Letterpad settings page to manage tokens.",
        403
      );
    }

    const session = await getServerSession();
    // NextAuth's subject is set at sign-in and preserved across session updates.
    const user = session?.user;
    const authorId =
      user && "sub" in user && typeof user.sub === "string"
        ? user.sub
        : undefined;
    if (!authorId)
      throw new TokenRequestError("Sign in to Letterpad first.", 401);

    const result = await action(authorId);
    return Response.json(result.body, {
      status: result.status ?? 200,
      headers,
    });
  } catch (error) {
    if (error instanceof TokenRequestError) {
      return Response.json(
        { error: error.message },
        { status: error.status, headers }
      );
    }
    logger.error("Failed to manage Letterpad MCP tokens.", error);
    return Response.json(
      { error: "Unable to manage MCP tokens." },
      { status: 500, headers }
    );
  }
}

export function GET(request: Request) {
  return withAuthor(request, async (authorId) => ({
    body: { tokens: await listMcpTokens(authorId) },
  }));
}

export function POST(request: Request) {
  return withAuthor(request, async (authorId) => {
    const name = new URL(request.url).searchParams.get("name")?.trim() ?? "";
    if (!name || name.length > 80) {
      throw new TokenRequestError(
        "Enter a token name of up to 80 characters.",
        400
      );
    }
    if (!(await canIssueMcpToken(authorId))) {
      throw new TokenRequestError(
        "Your account cannot create MCP tokens.",
        403
      );
    }
    return { body: await issueMcpToken(authorId, name), status: 201 };
  });
}

export function DELETE(request: Request) {
  return withAuthor(request, async (authorId) => {
    const id = new URL(request.url).searchParams.get("id");
    if (!id || id.length > 100)
      throw new TokenRequestError("Token not found.", 404);
    if (!(await revokeMcpToken(authorId, id))) {
      throw new TokenRequestError("Token not found.", 404);
    }
    return { body: { revoked: true } };
  });
}
