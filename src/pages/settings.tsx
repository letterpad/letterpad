import { Col, Collapse, Form, Input, PageHeader, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import { Role } from "@/__generated__/__types__";
import { Alert } from "antd";

import Head from "next/head";

import General from "@/components/settings/general";
import Appearance from "@/components/settings/appearance";
import Navigation from "@/components/settings/navigation";
import Social from "@/components/settings/social";
import Integrations from "@/components/settings/integrations";
import { CopyToClipboard } from "@/components/clipboard";
import { getSession } from "next-auth/react";
import Pages from "@/components/settings/pages";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";

const { Panel } = Collapse;

interface Props {
  settings: SettingsFragmentFragment;
  cloudinaryEnabledByAdmin: boolean;
  readOnly: boolean;
  showSocial: boolean;
}
function Settings({
  settings,
  cloudinaryEnabledByAdmin,
  readOnly,
  showSocial,
}: Props) {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <PageHeader className="site-page-header" title="Settings">
        <span className="help-text">
          Here you can customize your blog's settings.
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
            <General settings={settings} />
            <Appearance settings={settings} />
            <Pages settings={settings} />
            <Navigation settings={settings} />
            {showSocial && <Social settings={settings} />}
            <Integrations
              settings={settings}
              cloudinaryEnabledByAdmin={cloudinaryEnabledByAdmin}
            />
            <Collapse>
              <Panel header="Keys" key="1">
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
      //@ts-ignore
      showSocial: session?.user.role === Role.Admin,
      readOnly:
        process.env.READ_ONLY === "true" &&
        session?.user?.email === "demo@demo.com",
    },
  };
}
