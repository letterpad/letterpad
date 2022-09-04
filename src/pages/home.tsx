import { Button } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

import { ChangeUsername } from "@/components/profile/change-username";

import { useUpdateOptionsMutation } from "@/__generated__/queries/mutations.graphql";
import { useMeQuery } from "@/__generated__/queries/queries.graphql";

import { PageProps } from "@/types";

const Home: FC<PageProps> = ({ session }) => {
  const [settingsMutation] = useUpdateOptionsMutation();
  const me = useMeQuery();
  const router = useRouter();

  const onDismiss = () => {
    settingsMutation({ variables: { options: { intro_dismissed: true } } });
    router.push("/posts");
  };
  const username =
    me.data?.me?.__typename === "Author" ? me.data.me.username : "";

  const changeUsername =
    parseInt(username).toString() == username && username.match(/^[0-9]+$/);

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <Content>
        <div
          className="site-layout-background"
          style={{
            fontSize: "1rem",
            paddingTop: "10px",
            minHeight: "calc(100vh - 100px)",
            paddingBottom: 20,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            lineHeight: 1.6,
          }}
        >
          <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
            <p>Hi There 👋 ,</p>
            <p>
              Thank you for trying out Letterpad. We encourage you to update the
              below information first.
            </p>
            {changeUsername && (
              <>
                <p>
                  Your username is visible in the url. We suggest using text
                  instead of numbers
                </p>
                <ChangeUsername
                  author_id={session.id}
                  username={session.username}
                />
              </>
            )}
            <h4>Write about yourself:</h4>
            <p>
              Introduce yourself by updating your{" "}
              <Link href={"/settings?selected=general"}>profile</Link>
            </p>

            <h4>Write about your site:</h4>
            <p>
              Update your site details to let the audience know what your site
              is about by{" "}
              <Link href={"/settings?selected=general"}>clicking here</Link>
            </p>
            <p>
              To begin with, we recommend you to go through this{" "}
              <a
                href="https://docs.letterpad.app/setup/setting-up-your-blog"
                target="_blank"
                rel="noreferrer"
              >
                article
              </a>{" "}
              on getting started.
            </p>
            <p>
              Letterpad has a small footprint in terms of features and thats why
              it is extremely performant. As independent bloggers, it was
              important for us to provide a good expereince to readers and
              writers without any paywall.
            </p>
            <p>
              Letterpad is an open source project, meaning all its code is
              freely available{" "}
              <a
                href="https://github.com/letterpad/letterpad"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              . We believe that a community has more power in driving the
              roadmap of this product instead of us making decisions. If you
              have any feedback, feel free to share it with us by clicking the
              report button on the top right corner.
            </p>
            <p>
              If you would like to contribute, refer to this{" "}
              <a
                href="https://docs.letterpad.app/contribute"
                target="_blank"
                rel="noreferrer"
              >
                article
              </a>
              .
            </p>
            <p>Happy Blogging!</p>
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
