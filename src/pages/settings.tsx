import { Collapse, Form, Input, PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import CustomLayout from "@/components/layouts/Layout";
import { useUpdateOptionsMutation } from "@/__generated__/queries/mutations.graphql";
import { useEffect, useState } from "react";
import { Setting, SettingInputType } from "@/__generated__/__types__";
import withAuthCheck from "../hoc/withAuth";

import Head from "next/head";

import General from "@/components/settings/general";
import Appearance from "@/components/settings/appearance";
import Navigation from "@/components/settings/navigation";
import Social from "@/components/settings/social";
import Integrations from "@/components/settings/integrations";

const { Panel } = Collapse;

type ValueOf<T> = T[keyof T];

function Settings(props: { settings: Setting }) {
  const [settings, setSettings] = useState(props.settings);
  const [draft, setDraft] = useState<SettingInputType>({});
  const [settingsMutation] = useUpdateOptionsMutation();

  const updateSettings = async () => {
    if (Object.keys(draft).length === 0) return;
    settingsMutation({ variables: { options: draft } });
    setDraft({});
  };

  useEffect(() => {
    if (Object.keys(draft).length === 0) return;
    updateSettings();
  }, [Object.keys(draft)]);

  const onChange = (
    key: keyof SettingInputType,
    value: ValueOf<SettingInputType>,
  ) => {
    setSettings({ ...settings, [key]: value });
    setDraft({ [key]: value });
  };

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <PageHeader className="site-page-header" title="Settings">
        Here you can customize your blog's settings.
      </PageHeader>
      <Content>
        <div className="site-layout-background" style={{ padding: 24 }}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            layout="horizontal"
            size={"small"}
          >
            <General
              settings={settings}
              onChange={onChange}
              updateSettings={updateSettings}
            />
            <Appearance settings={settings} onChange={onChange} />
            <Navigation settings={settings} onChange={onChange} />
            <Social
              settings={settings}
              onChange={onChange}
              updateSettings={updateSettings}
            />
            <Integrations
              settings={settings}
              onChange={onChange}
              updateSettings={updateSettings}
            />
            <Collapse>
              <Panel header="Keys" key="1">
                <Form.Item label="Client Authorization Key">
                  <Input.TextArea
                    rows={4}
                    value={settings.client_token}
                    disabled={true}
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
const SettingsWithAuth = withAuthCheck(Settings);
SettingsWithAuth.layout = CustomLayout;
export default SettingsWithAuth;
