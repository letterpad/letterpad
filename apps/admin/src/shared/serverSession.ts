import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

import { basePath } from "../constants";
import { Session } from "../graphql/types";

export const getServerSession = async (
  headers: ReadonlyHeaders
): Promise<{ user: Session } | null> => {
  try {
    const sessionURL =
      (headers.get("origin") ?? `http://${headers.get("host")}`) +
      basePath +
      "/api/auth/session";
    const cookie = headers.get("cookie");
    if (!cookie) return null;
    const res = await fetch(sessionURL, {
      headers: { cookie },
    });
    const session = await res.json();
    return session.user ? session : null;
  } catch (e) {
    return null;
  }
};
