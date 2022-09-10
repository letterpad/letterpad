import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { SessionData } from "@/graphql/types";

export const useLetterpadSession = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [router, status]);

  if (!session?.user) return null;

  const _session = session as unknown as { user: SessionData };
  if (typeof window !== "undefined" && window.ga) {
    window.ga("set", "userId", _session.user.id);
  }
  return _session;
};
