import CustomLayout from "@/components/layouts/Layout";
import withAuthCheck from "@/hoc/withAuth";
import { useUpdateOptionsMutation } from "@/__generated__/queries/mutations.graphql";
import {
  ContainerOutlined,
  SettingOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const Home = () => {
  const [settingsMutation] = useUpdateOptionsMutation();
  const router = useRouter();
  const onDismiss = () => {
    settingsMutation({ variables: { options: { intro_dismissed: true } } });
    router.push("/posts");
  };

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
          <div style={{ width: 500, margin: "auto" }}>
            <p>Hi There 👋 ,</p>
            <p>
              Thank you for trying out Letterpad. This page will give you a
              quick tour of the features that you will need for publishing your
              first post.
            </p>
            <p>
              Letterpad has a simple concept of page and post. The difference is
              that posts can be grouped together with the help of tags while
              pages are independent. And then you can setup your{" "}
              <Link href="/settings">navigation menu</Link> with just tags and
              pages and this will be visible to your audience.
            </p>
            <p>
              If you have a tag by the name <strong>travel</strong> and you want
              all the posts linked with this tag to be visible in your homepage,
              then you should place this tag as the first item in the navigation
              menu.
            </p>
            <p>
              To create a post <ContainerOutlined />, click on the New button in{" "}
              <Link href="/posts">Posts page</Link>.
            </p>
            <p>
              To create a tag <TagsOutlined />, click on the New button in{" "}
              <Link href="/tags">Tags page</Link>.
            </p>
            <p>
              To create a tag and also link it with the post, you can
              create/edit a post and then inside settings <SettingOutlined />,
              you can enter the tags. New tags will automatically be created and
              linked.
            </p>
            <p>
              You can also look around to see the other features. We will
              publish helpful articles soon to help you with more helpful
              information.
            </p>
          </div>
          <Button type="link" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
        <style jsx>{``}</style>
      </Content>
    </>
  );
};

const HomeWithAuth = withAuthCheck(Home);
HomeWithAuth.layout = CustomLayout;
export default HomeWithAuth;
