import { Button, Divider, PageHeader } from "antd";
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
    true ||
    (parseInt(username).toString() == username && username.match(/^[0-9]+$/));

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <Content>
        <PageHeader
          title="Welcome to your new blog!"
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
          <div style={{ maxWidth: 600 }}>
            <ul style={{ padding: "0px 20px" }}>
              {changeUsername && (
                <li>
                  <p>
                    Your site name is{" "}
                    <a href={settings.site_url}>{settings.site_url}</a>. Change
                    your username to text instead of numbers.
                  </p>
                  <ChangeUsername
                    author_id={session.id}
                    username={session.username}
                  />
                  <Divider />
                </li>
              )}
              {author && (
                <li>
                  <p>
                    Introduce yourself. Write a short text about yourself,
                    change your profile image and update your social links by
                    visiting{"  "}
                    <Link href={"/profile?selected=basic"}>
                      Profile → Basic Information
                    </Link>
                    .
                  </p>
                  <Divider />
                  <li>
                    <p>
                      Update your site details by visiting{" "}
                      <Link href={"/settings?selected=general"}>
                        Settings → General
                      </Link>
                      .
                    </p>
                  </li>
                </li>
              )}
              <Divider />
              <li>
                <p>
                  Write your first post by visiting{" "}
                  <Link href="/api/create?type=post">Posts → New Post</Link>.
                </p>
              </li>
            </ul>

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
