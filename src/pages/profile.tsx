import { useCallback } from "react";
import { signOut } from "next-auth/react";
import {
  Button,
  Collapse,
  Form,
  Input,
  message,
  Modal,
  PageHeader,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import CustomLayout from "@/components/layouts/Layout";
import ImageUpload from "@/components/ImageUpload";
import {
  useMeQuery,
  useSettingsQuery,
} from "@/__generated__/queries/queries.graphql";
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
import { EventAction, track } from "@/track";

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
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);
  const { refetch } = useSettingsQuery();

  useEffect(() => {
    if (data?.me?.__typename === "Author") {
      setMe(data.me);
      setUsername(data.me.username);
      setEmail(data.me.email);
    }
  }, [loading]);

  const saveUserName = async () => {
    message.destroy("author");
    if (readOnly) {
      return setSavingUsername(false);
    }
    if (!me?.id || !username) return;
    setSavingUsername(true);
    track({
      eventAction: EventAction.Change,
      eventCategory: "profile",
      eventLabel: "id-username",
    });
    const result = await mutateAuthor({
      variables: {
        author: {
          username,
          id: me.id,
        },
      },
    });
    refetch();
    if (!result.data?.updateAuthor?.ok) {
      const error = result.data?.updateAuthor?.errors?.pop()?.message;
      if (error) {
        message.error({ key: "author", content: error, duration: 10 });
      }
    } else {
      message.success({
        key: "author",
        content: "Username saved",
        duration: 10,
      });
    }
    setSavingUsername(false);
  };

  const saveEmail = async () => {
    message.destroy("author");
    if (readOnly) {
      return setSaving(false);
    }
    if (!me?.id || !email) return;
    setSaving(true);
    track({
      eventAction: EventAction.Change,
      eventCategory: "profile",
      eventLabel: "id-email",
    });
    const result = await mutateAuthor({
      variables: {
        author: {
          email,
          id: me.id,
        },
      },
    });
    if (!result.data?.updateAuthor?.ok) {
      const error = result.data?.updateAuthor?.errors?.pop()?.message;
      if (error) {
        message.error({ key: "author", content: error, duration: 10 });
      }
    } else {
      Modal.success({
        title: "Email saved",
        okText: "Logout",
        closable: false,
        content: (
          <div>
            You have changed your email from <strong>{me.email}</strong> to{" "}
            <strong>{email}</strong>. We have sent you an email to your new
            email address. Please verify your email and login.
          </div>
        ),
        onOk() {
          signOut({
            redirect: true,
          });
        },
      });
    }
    setSaving(false);
  };

  const updateAuthor = async () => {
    try {
      message.destroy("author");
      if (draft && Object.keys(draft).length > 1) {
        track({
          eventAction: EventAction.Change,
          eventCategory: "profile",
          eventLabel: Object.keys(draft).join("-"),
        });
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
  };

  useEffect(() => {
    debounceUpdateAuthor();
  }, [draft]);

  const debounceUpdateAuthor = useCallback(debounce(updateAuthor, 1000), []);

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
                    placeholder="Write you full name"
                    size="middle"
                    value={me.name}
                    onChange={(e) => onChange("name", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="About You (html)">
                  <Input.TextArea
                    placeholder="Write about you. This will be displayed in the about me page. (4000 characters)"
                    value={me.bio}
                    onChange={(e) => onChange("bio", e.target.value)}
                    autoSize={{ minRows: 10, maxRows: 80 }}
                    rows={8}
                    maxLength={4000}
                  />
                </Form.Item>
                <Form.Item label="Occupation">
                  <Input
                    placeholder="What do you do ?"
                    value={me.occupation}
                    onChange={(e) => onChange("occupation", e.target.value)}
                    size="middle"
                  />
                </Form.Item>
                <Form.Item label="Company Name">
                  <Input
                    placeholder="Which company do you work for ?"
                    size="middle"
                    value={me.company_name}
                    onChange={(e) => onChange("company_name", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Email (private)">
                  <Input.Group compact>
                    <Input
                      size="middle"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: "calc(100% - 150px)" }}
                    />
                    <Button
                      type="primary"
                      size="middle"
                      onClick={saveEmail}
                      loading={saving}
                    >
                      Validate
                    </Button>
                  </Input.Group>
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
                      onClick={saveUserName}
                      loading={savingUsername}
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
                    placeholder="https://twitter.com/username"
                    size="middle"
                    value={me.social?.twitter}
                    onChange={(e) => onSocialChange("twitter", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Facebook">
                  <Input
                    placeholder="https://facebook.com/username"
                    size="middle"
                    value={me.social?.facebook}
                    onChange={(e) => onSocialChange("facebook", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Instagram">
                  <Input
                    placeholder="https://instagram.com/username"
                    size="middle"
                    value={me.social?.instagram}
                    onChange={(e) =>
                      onSocialChange("instagram", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Github">
                  <Input
                    placeholder="https://github.com/username"
                    size="middle"
                    value={me.social?.github}
                    onChange={(e) => onSocialChange("github", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="LinkedIn">
                  <Input
                    placeholder="https://linkedin.com/in/username/"
                    size="middle"
                    value={me.social?.linkedin}
                    onChange={(e) => onSocialChange("linkedin", e.target.value)}
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
