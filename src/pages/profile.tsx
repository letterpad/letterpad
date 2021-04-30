import { Collapse, Form, Input, PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import CustomLayout from "@/components/layouts/Layout";
import { initializeApollo } from "@/graphql/apollo";
import ImageUpload from "@/components/ImageUpload";
import {
  MeDocument,
  MeQuery,
  MeQueryVariables,
} from "@/__generated__/queries/queries.graphql";
import {
  UpdateAuthorMutation,
  UpdateAuthorMutationVariables,
  UpdateAuthorDocument,
} from "@/__generated__/queries/mutations.graphql";
import { useEffect, useState } from "react";
import {
  InputAuthor,
  Social,
  Author,
  Setting,
  MeResponse,
} from "@/__generated__/type-defs.graphqls";
import { removeTypenames } from "../../shared/removeTypenames";
import withAuthCheck from "../hoc/withAuth";
import ErrorMessage from "@/components/ErrorMessage";

const { Panel } = Collapse;

type ValueOf<T> = T[keyof T];

function Profile() {
  const [me, setMe] = useState<Author>();
  const [draft, setDraft] = useState<InputAuthor>();
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuthor().then(response => {
      if (!response) {
        return;
      }

      if (response.status && response.author) {
        setMe(response.author as Author);
      }

      if (!response.status) {
        setError(response.message);
      }
    });
  }, []);

  const updateAuthor = async (data?: InputAuthor) => {
    const apolloClient = await initializeApollo();

    if (!me) return;

    if (!data) {
      data = { id: me.id };
    }
    await apolloClient.mutate<
      UpdateAuthorMutation,
      UpdateAuthorMutationVariables
    >({
      mutation: UpdateAuthorDocument,
      variables: {
        author: { ...draft, ...data, id: me.id },
      },
    });
  };

  const onChange = (key: keyof InputAuthor, value: ValueOf<InputAuthor>) => {
    if (me) {
      setMe({ ...me, [key]: value });
      setDraft({ [key]: value, id: me.id });
    }
  };

  const onSocialChange = (key: keyof Social, value: string) => {
    if (me && me.social) {
      const social = { ...removeTypenames(me.social), [key]: value };
      onChange("social", social);
    }
  };

  if (!me) return null;
  if (error) return <ErrorMessage title="Profile" description={error} />;
  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        className="site-page-header"
        title="Profile"
        style={{ padding: 10 }}
      ></PageHeader>
      <Content style={{ margin: "16px 0px 0" }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: "72vh" }}
        >
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
                    onChange={e => onChange("name", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Short Bio">
                  <Input.TextArea
                    value={me.bio}
                    onBlur={() => updateAuthor()}
                    onChange={e => onChange("bio", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Email">
                  <Input
                    size="middle"
                    value={me.email}
                    onBlur={() => updateAuthor()}
                    onChange={e => onChange("email", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Avatar">
                  <ImageUpload
                    url={me.avatar || ""}
                    name="Avatar"
                    onDone={([res]) => {
                      updateAuthor({ avatar: res.src, id: me.id });
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
                    onChange={e => onSocialChange("twitter", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Facebook">
                  <Input
                    size="middle"
                    value={me.social?.facebook}
                    onBlur={() => updateAuthor()}
                    onChange={e => onSocialChange("facebook", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Instagram">
                  <Input
                    size="middle"
                    value={me.social?.instagram}
                    onBlur={() => updateAuthor()}
                    onChange={e => onSocialChange("instagram", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Github">
                  <Input
                    size="middle"
                    value={me.social?.github}
                    onBlur={() => updateAuthor()}
                    onChange={e => onSocialChange("github", e.target.value)}
                  />
                </Form.Item>
              </Panel>
              <Panel header="Change Password" key="3">
                <Form.Item label="Password">
                  <Input
                    size="middle"
                    onChange={e => onChange("password", e.target.value)}
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

export async function fetchAuthor() {
  const apolloClient = await initializeApollo();
  const me = await apolloClient.query<MeQuery, MeQueryVariables>({
    query: MeDocument,
  });

  if (me.data.me?.__typename === "Author") {
    return {
      author: me.data.me,
      message: "",
      status: true,
    };
  }
  if (me.data.me?.__typename === "AuthorNotFoundError") {
    return {
      author: null,
      message: me.data.me.message,
      status: false,
    };
  }
}
