import Link from "next/link";

import { useState } from "react";
// import { useUpdateNameMutation } from "../lib/queries/mutations.graphql";
// import { useViewerQuery, ViewerDocument } from "../lib/queries/queries.graphql";
import { signIn, signOut, useSession } from "next-auth/client";

import { initializeApollo } from "../lib/apollo";

const email = "admin@letterpad.app";
const password = "12345";

const Index = () => {
  // const { viewer } = useViewerQuery().data!;
  const [newName, setNewName] = useState("");
  // const [updateNameMutation] = useUpdateNameMutation();
  const [session, loading] = useSession();
  const onChangeName = () => {
    // updateNameMutation({
    //   variables: {
    //     name: newName,
    //   },
    //   //Follow apollo suggestion to update cache
    //   //https://www.apollographql.com/docs/angular/features/cache-updates/#update
    //   update: (
    //     store,
    //     {
    //       data: {
    //         updateName: { name },
    //       },
    //     },
    //   ) => {
    //     // Read the data from our cache for this query.
    //     const { viewer } = store.readQuery({ query: ViewerDocument });
    //     const newViewer = { ...viewer };
    //     // Add our comment from the mutation to the end.
    //     newViewer.name = name;
    //     // Write our data back to the cache.
    //     store.writeQuery({
    //       query: ViewerDocument,
    //       data: { viewer: newViewer },
    //     });
    //   },
    // });
  };

  const handleLogin = () => {
    signIn("credentials", {
      email,
      password,
      // The page where you want to redirect to after a
      // successful login
      callbackUrl: `${window.location.origin}/protected`,
    });
  };

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={signIn}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.name} <br />
          <button onClick={signOut}>Sign out</button>
        </>
      )}
    </>
  );

  return (
    <div>
      {/* You're signed in as {viewer.name} and you're {viewer.status}. Go to the{" "} */}
      <Link href="/about">
        <a>about</a>
      </Link>{" "}
      page.
      <div>
        <input
          type="text"
          placeholder="your new name..."
          onChange={e => setNewName(e.target.value)}
        />
        <input type="button" value="change" onClick={onChangeName} />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

// export async function getStaticProps() {
//   const apolloClient = initializeApollo();

//   // await apolloClient.query({
//   //   query: ViewerDocument,
//   // });

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//   };
// }

export default Index;
