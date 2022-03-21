import { useCallback } from "react";
import { Button, Collapse, Form, Input, message, PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import CustomLayout from "@/components/layouts/Layout";
import ImageUpload from "@/components/ImageUpload";
import { useMeQuery } from "@/__generated__/queries/queries.graphql";
import { useUpdateAuthorMutation } from "@/__generated__/queries/mutations.graphql";
import { useEffect, useState } from "react";
import { InputAuthor, Social } from "@/__generated__/__types__";
import { debounce, removeTypenames } from "@/shared/utils";
import withAuthCheck from "../hoc/withAuth";
import ErrorMessage from "@/components/ErrorMessage";
import Head from "next/head";
import Loading from "@/components/loading";
import { Alert } from "antd";
import { getSession } from "next-auth/react";

const { Panel } = Collapse;

type ValueOf<T> = T[keyof T];

function Profile({ readOnly }: { readOnly: boolean }) {
  const { data, loading, error } = useMeQuery({
    variables: {},
  });

  const [mutateAuthor] = useUpdateAuthorMutation();
  const [me, setMe] = useState<InputAuthor>();
  const [draft, setDraft] = useState<InputAuthor>();
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.me?.__typename === "Author") {
      setMe(data.me);
      setUsername(data.me.username);
    }
  }, [loading]);

  const updateAuthor = async () => {
    if (readOnly) {
      return setSaving(false);
    }
    try {
      if (draft && Object.keys(draft).length > 1) {
        const result = await mutateAuthor({
          variables: {
            author: draft,
          },
        });
        if (!result.data?.updateAuthor?.ok) {
          const error = result.data?.updateAuthor?.errors?.pop()?.message;
          if (error) {
            message.error({ key: "author", content: error, duration: 10 });
          }
        }
      }
    } catch (e) {}
    setSaving(false);
  };

  useEffect(() => {
    setSaving(true);
    debounceUpdateAuthor();
  }, [draft]);

  const debounceUpdateAuthor = useCallback(debounce(updateAuthor, 1000), [
    draft,
  ]);

  const onChange = (key: keyof InputAuthor, value: ValueOf<InputAuthor>) => {
    if (me) {
      setMe({ ...me, [key]: value });
      setDraft({ id: me.id, [key]: value });
    }
  };

  const onSocialChange = (key: keyof Social, value: string) => {
    if (me && me.social) {
      const social = { ...removeTypenames(me.social), [key]: value };
      onChange("social", social);
    }
  };

  if (loading) return <Loading />;

  if (data?.me?.__typename === "AuthorNotFoundError") {
    return <ErrorMessage title="Profile" description={data.me.message} />;
  }

  if (error || !me) {
    return <ErrorMessage title="Profile" description={error} />;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageHeader className="site-page-header" title="Profile">
        Set up your profile. This will be used by themes to add author
        information for your blog posts.
      </PageHeader>
      <Content>
        {readOnly && (
          <Alert
            message="This section is read only. You will be able to make changes, but they wont be saved."
            type="warning"
          />
        )}
        <div className="site-layout-background" style={{ padding: 24 }}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            layout="horizontal"
            size={"small"}
          >
            <Collapse defaultActiveKey={["1"]}>
              <Panel header="Basic Information" key="1">
                <Form.Item label="Full Name">
                  <Input
                    size="middle"
                    value={me.name}
                    onChange={(e) => onChange("name", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Short Bio">
                  <Input.TextArea
                    value={me.bio}
                    onChange={(e) => onChange("bio", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Email">
                  <Input
                    size="middle"
                    value={me.email}
                    onChange={(e) => onChange("email", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Username">
                  <Input.Group compact>
                    <Input
                      size="middle"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{ width: "calc(100% - 150px)" }}
                    />
                    <Button
                      type="primary"
                      size="middle"
                      onClick={() => {
                        onChange("username", username);
                      }}
                      loading={saving}
                    >
                      Validate
                    </Button>
                  </Input.Group>
                </Form.Item>
                <Form.Item label="Avatar">
                  <ImageUpload
                    url={me.avatar || ""}
                    name="Avatar"
                    onDone={([res]) => {
                      onChange("avatar", res.src);
                    }}
                  />
                </Form.Item>
              </Panel>
              <Panel header="Social Information" key="2">
                <Form.Item label="Twitter">
                  <Input
                    size="middle"
                    value={me.social?.twitter}
                    onChange={(e) => onSocialChange("twitter", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Facebook">
                  <Input
                    size="middle"
                    value={me.social?.facebook}
                    onChange={(e) => onSocialChange("facebook", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Instagram">
                  <Input
                    size="middle"
                    value={me.social?.instagram}
                    onChange={(e) =>
                      onSocialChange("instagram", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Github">
                  <Input
                    size="middle"
                    value={me.social?.github}
                    onChange={(e) => onSocialChange("github", e.target.value)}
                  />
                </Form.Item>
              </Panel>
              <Panel header="Change Password" key="3">
                <Form.Item label="Password">
                  <Input
                    size="middle"
                    onChange={(e) => onChange("password", e.target.value)}
                  />
                </Form.Item>
              </Panel>
            </Collapse>
          </Form>
        </div>
      </Content>
    </>
  );
}

const ProfileWithAuth = withAuthCheck(Profile);
ProfileWithAuth.layout = CustomLayout;
export default ProfileWithAuth;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      readOnly:
        process.env.READ_ONLY === "true" &&
        session?.user?.email === "demo@demo.com",
    },
  };
}
