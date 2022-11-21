import {
  Col,
  Form,
  Input,
  PageHeader,
  Popconfirm,
  Row,
  Typography,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import { useRouter } from "next/router";

import { CopyToClipboard } from "@/components/clipboard";
import Appearance from "@/components/settings/appearance";
import General from "@/components/settings/general";
import Integrations from "@/components/settings/integrations";
import Navigation from "@/components/settings/navigation";
import Pages from "@/components/settings/pages";
import { Accordion } from "@/components_v2/accordion";
import { Buttonv2 } from "@/components_v2/button";

import { useDeleteAuthorMutation } from "@/__generated__/queries/mutations.graphql";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";

import { PageProps } from "@/types";

interface Props extends PageProps {
  settings: SettingsFragmentFragment;
  cloudinaryEnabledByAdmin: boolean;
}
function Settings({ settings, cloudinaryEnabledByAdmin }: Props) {
  const router = useRouter();
  const onPanelClick = (key) => {
    router.replace({ query: { selected: key } });
  };
  const [deleteAuthor] = useDeleteAuthorMutation();
  const confirm = async () => {
    await deleteAuthor();
    router.push("/login?deleted=true");
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
        <div className="site-layout-background" style={{ padding: 24 }}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 10 }}
            layout="horizontal"
            size={"small"}
          >
            <Accordion
              onChange={onPanelClick}
              activeKey={router.query.selected}
            >
              <Accordion.Item label="General Settings" id="general">
                <General settings={settings} />
              </Accordion.Item>
              <Accordion.Item label="Appearance" id="appearance">
                <Appearance settings={settings} />
              </Accordion.Item>
              <Accordion.Item label="Pages" id="pages">
                <Pages settings={settings} />
              </Accordion.Item>
              <Accordion.Item label="Navigation" id="navigation">
                <Form.Item>
                  <Typography.Text type="secondary">
                    Configure the navigation menu of your blog. The first item
                    in the navigation menu will be the homepage of your blog.
                  </Typography.Text>
                </Form.Item>
                <Navigation settings={settings} />
              </Accordion.Item>
              <Accordion.Item label="Integrations" id="integrations">
                <Integrations
                  settings={settings}
                  cloudinaryEnabledByAdmin={cloudinaryEnabledByAdmin}
                />
              </Accordion.Item>
              <Accordion.Item label="Keys" id="keys">
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
              </Accordion.Item>
              <Accordion.Item label="Delete your account" id="account">
                <Form.Item>
                  <Typography.Text type="secondary">
                    If due to some reason you wish to move out of Letterpad, you
                    may delete your account. All data will be deleted and you
                    will not be able to recover it. You will be logged out after
                    this action.
                  </Typography.Text>
                </Form.Item>
                <Form.Item>
                  <Row>
                    <Col span={18}>
                      <Popconfirm
                        title="Are you sure you want to delete your account ?"
                        onConfirm={confirm}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Buttonv2 variant="danger">
                          Delete your account
                        </Buttonv2>
                      </Popconfirm>
                    </Col>
                  </Row>
                </Form.Item>
              </Accordion.Item>
            </Accordion>
          </Form>
        </div>
      </Content>
    </>
  );
}

export default Settings;

export async function getServerSideProps(context) {
  return {
    props: {
      cloudinaryEnabledByAdmin: !!(
        process.env.CLOUDINARY_KEY &&
        process.env.CLOUDINARY_NAME &&
        process.env.CLOUDINARY_SECRET
      ),
    },
  };
}
