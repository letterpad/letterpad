import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";

export default function Page() {
  const [session, loading] = useSession();
  const [content, setContent] = useState();

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return <div>Access denied</div>;
  }

  // If session exists, display content
  return (
    <div>
      <h1>Protected Page</h1>
      <p>
        <strong>{content || "\u00a0"}</strong>
      </p>
    </div>
  );
}
