import { Collapse, Form, Input, PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import CustomLayout from "../layouts/Layout";
import { initializeApollo } from "../graphql/apollo";
import ImageUpload from "../components/ImageUpload";
import {
  UpdateOptionsMutation,
  UpdateOptionsMutationVariables,
  UpdateOptionsDocument,
  Setting,
} from "../../__generated__/src/graphql/queries/queries.graphql";
import { useEffect, useState } from "react";
import { OptionInputType } from "../../__generated__/src/graphql/type-defs.graphqls";
import withAuthCheck from "../hoc/withAuth";
import Navigation from "../components/navigation-builder";

const { Panel } = Collapse;

type ValueOf<T> = T[keyof T];

function Settings(props: { settings: Setting }) {
  const [settings, setSettings] = useState(props.settings);
  const [draft, setDraft] = useState<OptionInputType>({});

  const updateSettings = async () => {
    const apolloClient = initializeApollo();

    if (Object.keys(draft).length === 0) return;

    await apolloClient.mutate<
      UpdateOptionsMutation,
      UpdateOptionsMutationVariables
    >({
      mutation: UpdateOptionsDocument,
      variables: {
        options: draft,
      },
    });
    localStorage.settings = JSON.stringify(settings);
    setDraft({});
  };

  useEffect(() => {
    if (Object.keys(draft).length === 0) return;
    updateSettings();
  }, [Object.keys(draft)]);

  const onChange = (
    key: keyof OptionInputType,
    value: ValueOf<OptionInputType>,
  ) => {
    setSettings({ ...settings, [key]: value });
    setDraft({ [key]: value });
  };

  return (
    <CustomLayout settings={settings}>
      <PageHeader
        onBack={() => window.history.back()}
        className="site-page-header"
        title="Settings"
        style={{ padding: 10 }}
      ></PageHeader>
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
              <Panel header="General Settings" key="1">
                <Form.Item label="Site Title">
                  <Input
                    size="middle"
                    value={settings.site_title}
                    onBlur={updateSettings}
                    onChange={e => onChange("site_title", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Site Tagline">
                  <Input
                    size="middle"
                    value={settings.site_tagline}
                    onBlur={updateSettings}
                    onChange={e => onChange("site_tagline", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Site Email">
                  <Input
                    size="middle"
                    value={settings.site_email}
                    onBlur={updateSettings}
                    onChange={e => onChange("site_email", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Short Description">
                  <Input
                    size="middle"
                    value={settings.site_description}
                    onBlur={updateSettings}
                    onChange={e => onChange("site_description", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Site Url">
                  <Input
                    size="middle"
                    value={settings.site_url}
                    onBlur={updateSettings}
                    onChange={e => onChange("site_url", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Footer Description">
                  <Input
                    size="middle"
                    value={settings.site_footer}
                    onBlur={updateSettings}
                    onChange={e => onChange("site_footer", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Google Analytics">
                  <Input
                    size="middle"
                    value={settings.google_analytics}
                    onBlur={updateSettings}
                    onChange={e => onChange("google_analytics", e.target.value)}
                  />
                </Form.Item>
              </Panel>
            </Collapse>
            <Collapse defaultActiveKey={["1"]}>
              <Panel header="Appearance" key="1">
                <Form.Item label="Logo">
                  <ImageUpload
                    name="Logo"
                    url={settings.site_logo.src}
                    onDone={([res]) =>
                      onChange("site_logo", {
                        src: res.src,
                        width: res.size.width,
                        height: res.size.height,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item label="Favicon">
                  <ImageUpload
                    name="Favicon"
                    url={settings.site_favicon.src}
                    onDone={([res]) =>
                      onChange("site_favicon", {
                        src: res.src,
                        width: res.size.width,
                        height: res.size.height,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item label="Banner">
                  <ImageUpload
                    name="Banner"
                    url={settings.banner.src}
                    onDone={([res]) =>
                      onChange("banner", {
                        src: res.src,
                        width: res.size.width,
                        height: res.size.height,
                      })
                    }
                  />
                </Form.Item>
              </Panel>
            </Collapse>
            <Collapse defaultActiveKey={["1"]}>
              <Panel header="Navigation" key="1">
                <Navigation
                  menuData={settings.menu}
                  updateOption={option => onChange("menu", option)}
                />
              </Panel>
            </Collapse>
            <Collapse defaultActiveKey={["1"]}>
              <Panel header="Social  Settings" key="1">
                <Form.Item label="Twitter">
                  <Input
                    size="middle"
                    value={settings.social_twitter}
                    onBlur={updateSettings}
                    onChange={e => onChange("social_twitter", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Facebook">
                  <Input
                    size="middle"
                    value={settings.social_facebook}
                    onBlur={updateSettings}
                    onChange={e => onChange("social_facebook", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Instagram">
                  <Input
                    size="middle"
                    value={settings.social_instagram}
                    onBlur={updateSettings}
                    onChange={e => onChange("social_instagram", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Github">
                  <Input
                    size="middle"
                    value={settings.social_github}
                    onBlur={updateSettings}
                    onChange={e => onChange("social_github", e.target.value)}
                  />
                </Form.Item>
              </Panel>
            </Collapse>
            <Collapse defaultActiveKey={["1"]}>
              <Panel header="Integrations" key="1">
                <Form.Item label="Cloudinary Name">
                  <Input
                    size="middle"
                    value={settings.cloudinary_name}
                    onBlur={updateSettings}
                    onChange={e => onChange("cloudinary_name", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Cloudinary Key">
                  <Input
                    size="middle"
                    value={settings.cloudinary_key}
                    onBlur={updateSettings}
                    onChange={e => onChange("cloudinary_key", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Cloudinary Secret">
                  <Input
                    size="middle"
                    value={settings.cloudinary_secret}
                    onBlur={updateSettings}
                    onChange={e =>
                      onChange("cloudinary_secret", e.target.value)
                    }
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

export default withAuthCheck(Settings);
