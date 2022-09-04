import { Col, Collapse, Form, Input, PageHeader, Row } from "antd";
import { Alert } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

import { CopyToClipboard } from "@/components/clipboard";
import Appearance from "@/components/settings/appearance";
import General from "@/components/settings/general";
import Integrations from "@/components/settings/integrations";
import Navigation from "@/components/settings/navigation";
import Pages from "@/components/settings/pages";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";

const { Panel } = Collapse;

interface Props {
  settings: SettingsFragmentFragment;
  cloudinaryEnabledByAdmin: boolean;
  readOnly: boolean;
}
function Settings({ settings, cloudinaryEnabledByAdmin, readOnly }: Props) {
  const router = useRouter();
  const onPanelClick = (key) => {
    router.replace({ query: { selected: key } });
  };

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <PageHeader className="site-page-header" title="Settings">
        <span className="help-text">
          Here you can customize your blog&apos;s settings.
        </span>
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
            <Collapse onChange={onPanelClick} activeKey={router.query.selected}>
              <Panel
                header="General Settings"
                key="general"
                className="general-settings"
              >
                <General settings={settings} />
              </Panel>
              <Panel header="Appearance" key="appearance">
                <Appearance settings={settings} />
              </Panel>
              <Panel header="Pages" key="pages" className="pages">
                <Pages settings={settings} />
              </Panel>
              <Panel
                header="Navigation"
                key="navigation"
                className="navigation"
              >
                <Navigation settings={settings} />
              </Panel>
              <Panel
                header="Integrations"
                key="integrations"
                className="integrations"
              >
                <Integrations
                  settings={settings}
                  cloudinaryEnabledByAdmin={cloudinaryEnabledByAdmin}
                />
              </Panel>
              <Panel header="Keys" key="keys">
                <Form.Item label="Client Authorization Key">
                  <Row>
                    <Col span={18}>
                      <Input.TextArea
                        rows={4}
                        value={settings.client_token}
                        id="client_token"
                      />
                    </Col>
                    <Col span={6}>
                      <CopyToClipboard elementId="client_token" />
                    </Col>
                  </Row>
                </Form.Item>
              </Panel>
            </Collapse>
          </Form>
        </div>
      </Content>
    </>
  );
}

export default Settings;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      cloudinaryEnabledByAdmin: !!(
        process.env.CLOUDINARY_KEY &&
        process.env.CLOUDINARY_NAME &&
        process.env.CLOUDINARY_SECRET
      ),
      readOnly:
        process.env.READ_ONLY === "true" &&
        session?.user?.email === "demo@demo.com",
    },
  };
}
