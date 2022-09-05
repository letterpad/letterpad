import { Button, PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

import { ChangeUsername } from "@/components/profile/change-username";

import { useUpdateOptionsMutation } from "@/__generated__/queries/mutations.graphql";
import { useMeQuery } from "@/__generated__/queries/queries.graphql";

import { PageProps } from "@/types";

const Home: FC<PageProps> = ({ session, settings }) => {
  const [settingsMutation] = useUpdateOptionsMutation();
  const me = useMeQuery();
  const router = useRouter();

  const onDismiss = () => {
    settingsMutation({ variables: { options: { intro_dismissed: true } } });
    router.push("/posts");
  };
  const author = me.data?.me?.__typename === "Author" ? me.data.me : null;
  const username = author?.username || "";
  const changeUsername =
    parseInt(username).toString() == username && username.match(/^[0-9]+$/);

  let count = 1;
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Content>
        <PageHeader
          title="Welcome to your new blog! 🎉"
          className="site-page-header"
        >
          <span className="help-text">
            Thank you for trying out Letterpad. We encourage you to update the
            below information first. This will allow search engines to know
            about your site.
          </span>
        </PageHeader>
        <div
          className="site-layout-background"
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
                  author_id={session.id}
                  username={session.username}
                />
              </Section>
            )}
            {author && (
              <>
                <Section title={`${count++}. Update your profile page`}>
                  <p>
                    Write a short text about yourself, change your profile image
                    and update your social links by visiting{"  "}
                    <Link href={"/profile?selected=basic"}>
                      Profile → Basic Information
                    </Link>
                    .
                  </p>
                </Section>
                <Section title={`${count++}. Update site details`}>
                  <p>
                    Update your site details by visiting{" "}
                    <Link href={"/settings?selected=general"}>
                      Settings → General
                    </Link>
                    .
                  </p>
                </Section>
              </>
            )}

            <Section title={`${count++}. Write your first post`}>
              <p>
                Write your first post by visiting{" "}
                <Link href="/api/create?type=post">Posts → New Post</Link>.
              </p>
            </Section>

            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
          <Button type="link" onClick={onDismiss} data-testid="dismissIntro">
            Dismiss
          </Button>
        </div>
      </Content>
    </>
  );
};
export default Home;

const Section = ({ children, title }) => {
  return (
    <>
      <h4 style={{ borderLeft: "2px solid green", paddingLeft: 8 }}>{title}</h4>
      <section
        style={{
          background: "rgb(var(--content-bg))",
          padding: 20,
          marginBottom: 20,
        }}
      >
        {children}
      </section>
    </>
  );
};
