import { Collapse, Form, Input } from "antd";
import { Content } from "antd/lib/layout/layout";
import CustomLayout from "../layouts/Layout";
import { initializeApollo } from "../graphql/apollo";
import ImageUpload from "../components/ImageUpload";
import {
  MeDocument,
  MeQuery,
  MeQueryVariables,
  UpdateAuthorMutation,
  UpdateAuthorMutationVariables,
  UpdateAuthorDocument,
} from "../../__generated__/src/graphql/queries/queries.graphql";
import { useEffect, useState } from "react";
import {
  InputAuthor,
  Social,
  Author,
  Setting,
  MeResponse,
} from "../../__generated__/src/graphql/type-defs.graphqls";
import { removeTypenames } from "../../shared/removeTypenames";
import withAuthCheck from "../hoc/withAuth";
import { Optional } from "../../shared/types";

const { Panel } = Collapse;

type ValueOf<T> = T[keyof T];

function Profile({ data, settings }: { data: MeResponse; settings: Setting }) {
  const [me, setMe] = useState<Author>();
  const [draft, setDraft] = useState<InputAuthor>();

  useEffect(() => {
    if (data.__typename === "Author") {
      setMe(data as Author);
      setDraft({ id: data.id });
    }
  }, []);

  const updateAuthor = async (data?: InputAuthor) => {
    const apolloClient = initializeApollo();

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
        author: { ...draft, ...data },
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

  return (
    <CustomLayout settings={settings}>
      <Content style={{ margin: "24px 16px 0" }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 360 }}
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
    </CustomLayout>
  );
}

export default withAuthCheck(Profile);

export async function getServerSideProps(context) {
  const apolloClient = initializeApollo({}, context);

  const me = await apolloClient.query<MeQuery, MeQueryVariables>({
    query: MeDocument,
  });

  return {
    props: {
      data: me.data.me,
    },
  };
}
