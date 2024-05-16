import { InputAuthor, MeFragmentFragment } from "letterpad-graphql";
import Link from "next/link";
import { FC, useEffect } from "react";
import { Button } from "ui/dist/index.mjs";

import { setIntroDimissed } from "@/app/(protected)/home/_feature/components/visibility";
import { useUpdateAuthor } from "@/app/(protected)/posts/_feature/api.client";
import { ChangeUsername } from "@/app/(protected)/profile/_feature/components/change-username";

import { PageProps } from "@/types";

interface Props {
  author: MeFragmentFragment;
  settings: PageProps["settings"];
}
type Status = keyof InputAuthor;
export const GettingStarted: FC<Props> = ({ author, settings }) => {
  const { updateAuthor } = useUpdateAuthor();
  const username = author.username || "";
  const changeUsername =
    parseInt(username).toString() == username && username.match(/^[0-9]+$/);

  let count = 1;

  const updateStatus = async (status: Status) => {
    await updateAuthor({ [status]: true, id: author.id });
  };

  useEffect(() => {
    return () => {
      setIntroDimissed(true);
    };
  }, []);
  return (
    <div style={{ maxWidth: 600 }} className="help-text">
      {changeUsername && (
        <Section title={`${count++}. Update your username`}>
          <p>
            Your site name is{" "}
            <a href={settings.site_url}>{settings.site_url}</a>. Change your
            username <i>{username}</i> to text instead of just numbers.
          </p>
          <ChangeUsername author_id={author.id} username={author.username} />
        </Section>
      )}
      {author && (
        <>
          {!author.profile_updated && (
            <Section title={`${count++}. Update your profile page`}>
              <p>
                Write a short text about yourself, change your profile image and
                update your social links by visiting{"  "}
                <Link href={"/profile?selected=basic"}>
                  Profile → About You
                </Link>
                .
              </p>
              <Button
                size="small"
                onClick={() => updateStatus("profile_updated")}
                className="mt-2"
              >
                Done
              </Button>
            </Section>
          )}
          {!author.settings_updated && (
            <Section title={`${count++}. Update your blog details`}>
              <p>
                Update your site details by visiting{" "}
                <Link href={"/settings?selected=general"}>
                  Settings → General
                </Link>
                .
              </p>
              <Button
                size="small"
                onClick={() => updateStatus("settings_updated")}
                className="mt-2"
              >
                Done
              </Button>
            </Section>
          )}
        </>
      )}

      {!author.first_post_published && (
        <Section title={`${count++}. Publish your first post`}>
          <p>
            Publish your first post by visiting{" "}
            <Link href="/api/create?type=post">Posts → New Post</Link>.
          </p>
        </Section>
      )}
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

const Section = ({ children, title }) => {
  return (
    <>
      <h4
        style={{ borderLeft: "2px solid green", paddingLeft: 8 }}
        className="mb-4"
      >
        {title}
      </h4>
      <section className="mb-10 rounded-md bg-gray-200 p-6 dark:bg-gray-800">
        {children}
      </section>
    </>
  );
};
