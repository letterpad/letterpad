import { Collapse, Form, Input, PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import CustomLayout from "@/components/layouts/Layout";
import ImageUpload from "@/components/ImageUpload";
import { useMeQuery } from "@/__generated__/queries/queries.graphql";
import { useUpdateAuthorMutation } from "@/__generated__/queries/mutations.graphql";
import { useEffect, useState } from "react";
import { InputAuthor, Social } from "@/__generated__/__types__";
import { removeTypenames } from "../shared/utils";
import withAuthCheck from "../hoc/withAuth";
import ErrorMessage from "@/components/ErrorMessage";
import Head from "next/head";

const { Panel } = Collapse;

type ValueOf<T> = T[keyof T];

function Profile() {
  const { data, loading, error } = useMeQuery({
    variables: {},
  });

  const [mutateAuthor] = useUpdateAuthorMutation();
  const [me, setMe] = useState<InputAuthor>();
  const [draft, setDraft] = useState<InputAuthor>();

  useEffect(() => {
    if (data?.me?.__typename === "Author") {
      setMe(data.me);
    }
  }, [loading]);

  const updateAuthor = async () => {
    if (draft) {
      mutateAuthor({
        variables: {
          author: draft,
        },
      });
    }
  };

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

  if (loading) return <>Loading..</>;

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
      <PageHeader className="site-page-header" title="Profile"></PageHeader>
      <Content>
        <div className="site-layout-background" style={{ padding: 16 }}>
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
                    onBlur={() => updateAuthor()}
                    onChange={(e) => onChange("name", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Short Bio">
                  <Input.TextArea
                    value={me.bio}
                    onBlur={() => updateAuthor()}
                    onChange={(e) => onChange("bio", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Email">
                  <Input
                    size="middle"
                    value={me.email}
                    onBlur={() => updateAuthor()}
                    onChange={(e) => onChange("email", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Avatar">
                  <ImageUpload
                    url={me.avatar || ""}
                    name="Avatar"
                    onDone={([res]) => {
                      onChange("avatar", res.src);
                      updateAuthor();
                    }}
                  />
                </Form.Item>
              </Panel>
              <Panel header="Social Information" key="2">
                <Form.Item label="Twitter">
                  <Input
                    size="middle"
                    value={me.social?.twitter}
                    onBlur={() => updateAuthor()}
                    onChange={(e) => onSocialChange("twitter", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Facebook">
                  <Input
                    size="middle"
                    value={me.social?.facebook}
                    onBlur={() => updateAuthor()}
                    onChange={(e) => onSocialChange("facebook", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Instagram">
                  <Input
                    size="middle"
                    value={me.social?.instagram}
                    onBlur={() => updateAuthor()}
                    onChange={(e) =>
                      onSocialChange("instagram", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Github">
                  <Input
                    size="middle"
                    value={me.social?.github}
                    onBlur={() => updateAuthor()}
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
