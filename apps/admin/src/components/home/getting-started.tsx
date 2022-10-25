import { PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import Link from "next/link";
import { FC, useEffect } from "react";

import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";

import { setIntroDimissed } from "@/components/home/visibility";
import { ChangeUsername } from "@/components/profile/change-username";
import { Buttonv2 } from "@/components_v2/button";

import { InputAuthor } from "@/__generated__/__types__";
import { MeFragmentFragment } from "@/__generated__/queries/queries.graphql";

import { PageProps } from "@/types";

interface Props {
  author: MeFragmentFragment;
  settings: PageProps["settings"];
}
type Status = keyof InputAuthor;
export const GettingStarted: FC<Props> = ({ author, settings }) => {
  const { updateAuthor, updateLocalState } = useUpdateAuthor(author.id);
  const username = author.username || "";
  const changeUsername =
    parseInt(username).toString() == username && username.match(/^[0-9]+$/);

  let count = 1;

  const updateStatus = async (status: Status) => {
    await updateAuthor({ [status]: true });
    updateLocalState({ [status]: true });
  };

  useEffect(() => {
    return () => {
      setIntroDimissed(true);
    };
  }, []);
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Content>
        <PageHeader
          title="Welcome to your blog! 🎉"
          className="site-page-header"
        >
          <span className="help-text">
            Thank you for trying out Letterpad. We encourage you to update the
            below information first. This will allow search engines to discover
            your site.
          </span>
        </PageHeader>
        <div
          className="site-layout-background "
          style={{
            fontSize: "1rem",
            padding: "40px 20px",
            minHeight: "calc(100vh - 100px)",
            paddingBottom: 20,
            display: "flex",
            alignItems: "top",
            flexDirection: "column",
            justifyContent: "left",
            lineHeight: 1.6,
          }}
        >
          <div style={{ maxWidth: 600 }} className="help-text">
            {changeUsername && (
              <Section title={`${count++}. Update your username`}>
                <p>
                  Your site name is{" "}
                  <a href={settings.site_url}>{settings.site_url}</a>. Change
                  your username <i>{username}</i> to text instead of just
                  numbers.
                </p>
                <ChangeUsername
                  author_id={author.id}
                  username={author.username}
                />
              </Section>
            )}
            {author && (
              <>
                {!author.profile_updated && (
                  <Section title={`${count++}. Update your profile page`}>
                    <p>
                      Write a short text about yourself, change your profile
                      image and update your social links by visiting{"  "}
                      <Link href={"/profile?selected=basic"}>
                        Profile → Basic Information
                      </Link>
                      .
                    </p>
                    <Buttonv2
                      variant="dark"
                      size="small"
                      onClick={() => updateStatus("profile_updated")}
                      className="mt-2"
                    >
                      Done
                    </Buttonv2>
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
                    <Buttonv2
                      variant="dark"
                      size="small"
                      onClick={() => updateStatus("settings_updated")}
                      className="mt-2"
                    >
                      Done
                    </Buttonv2>
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
        </div>
      </Content>
    </>
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
      <section
        style={{
          background: "rgb(var(--content-bg))",
        }}
        className="mb-10 p-6"
      >
        {children}
      </section>
    </>
  );
};
