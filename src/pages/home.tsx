import { useRouter } from "next/router";
import { FC, useCallback, useEffect } from "react";

import { GettingStarted } from "@/components/home/getting-started";

import { useUpdateOptionsMutation } from "@/__generated__/queries/mutations.graphql";
import { useMeQuery } from "@/__generated__/queries/queries.graphql";
import { EventAction, track } from "@/track";

import { PageProps } from "@/types";

const Home: FC<PageProps> = ({ settings }) => {
  const [settingsMutation] = useUpdateOptionsMutation();
  const me = useMeQuery();
  const router = useRouter();

  const onDismiss = useCallback(() => {
    track({
      eventAction: EventAction.Click,
      eventCategory: "onboarding",
      eventLabel: "completed",
    });
    settingsMutation({ variables: { options: { intro_dismissed: true } } });
    router.push("/posts");
  }, [settingsMutation, router]);

  const author = me.data?.me?.__typename === "Author" ? me.data.me : null;
  const username = author?.username || "";
  const changeUsername =
    parseInt(username).toString() == username && username.match(/^[0-9]+$/);

  const showGettingStarted =
    changeUsername ||
    !author?.profile_updated ||
    !author?.first_post_published ||
    !author.settings_updated;

  useEffect(() => {
    if (!showGettingStarted) onDismiss();
  }, [showGettingStarted, onDismiss]);

  if (author?.__typename !== "Author") return <div>Future</div>;

  if (showGettingStarted) {
    return withDismiss(
      <GettingStarted author={author} settings={settings} />,
      onDismiss,
    );
  }
  return withDismiss(null, onDismiss);
};
export default Home;

const withDismiss = (children: React.ReactNode, onDismiss) => {
  return (
    <>
      <button
        onClick={onDismiss}
        style={{ height: 10, width: 10, opacity: 0 }}
        data-testid="dismissIntro"
      >
        -
      </button>
      {children}
    </>
  );
};
