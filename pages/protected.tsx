import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import {
  PostDocument,
  PostQuery,
  PostQueryVariables,
} from "../__generated__/lib/queries/queries.graphql";
import { initializeApollo } from "../lib/apollo";

export default function Page(pageProps) {
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

export async function getServerSideProps(context) {
  const apolloClient = await initializeApollo({}, context);

  const post = await apolloClient.query<PostQuery, PostQueryVariables>({
    query: PostDocument,
    variables: {
      filters: {
        id: 1,
      },
    },
  });

  return {
    props: {
      data: post.data,
    },
  };
}
