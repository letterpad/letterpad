import { SessionData } from "@/graphql/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useLetterpadSession = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status]);

  if (!session?.user) return null;

  const _session = session as unknown as { user: SessionData };
  return _session;
};
