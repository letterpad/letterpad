import { useSession } from "next-auth/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { initializeApollo } from "@/graphql/apollo";
import {
  Setting,
  SettingsDocument,
  SettingsQuery,
  SettingsQueryVariables,
} from "@/__generated__/queries/queries.graphql";
import { LetterpadProvider } from "src/context/LetterpadProvider";

const withAuthCheck = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
) => {
  return (props: T) => {
    const [session, loading] = useSession();
    const [settings, setSettings] = useState<null | Setting>(null);
    const router = useRouter();
    useEffect(() => {
      console.log(session);
      if (!settings) {
        getSettings()
          .then(res => {
            if (res.data.settings?.__typename === "Setting") {
              setSettings(res.data.settings as Setting);
            } else {
              if (!session && !loading) {
                router.push("/api/auth/signin");
              }
            }
          })
          .catch(e => {
            router.push("/api/auth/signin");
          });
      }
    }, [loading]);

    if (!session || !settings) return null;
    return (
      <LetterpadProvider value={settings}>
        <WrappedComponent {...props} settings={settings} />
      </LetterpadProvider>
    );
  };
};

export default withAuthCheck;

async function getSettings() {
  const client = await initializeApollo();
  const settings = await client.query<SettingsQuery, SettingsQueryVariables>({
    query: SettingsDocument,
  });

  return settings;
}
