import { useState } from "react";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import {
  Alert,
  Button,
  Divider,
  Form,
  Input,
  message,
  PageHeader,
  Steps,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";

interface Props {
  settings: SettingsFragmentFragment;
  readOnly: boolean;
}

const { Step } = Steps;

const steps = [
  {
    title: "Domain Info",
    content: "First-content",
  },
  {
    title: "Second",
    content: "Second-content",
  },
  {
    title: "Last",
    content: "Last-content",
  },
];

const DomainMapping: React.FC<Props> = ({ settings, readOnly }) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current === 2) return;
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Head>
        <title>Domain Mapping</title>
      </Head>
      <PageHeader className="site-page-header" title="Domain Mapping">
        <span className="help-text">
          Link your custom domain with Letterpad
        </span>
      </PageHeader>

      <div className="steps-content">
        <Content>
          {readOnly && (
            <Alert
              message="This section is read only. You will be able to make changes, but they wont be saved."
              type="warning"
            />
          )}
          <div className="site-layout-background" style={{ padding: 24 }}>
            <Steps current={current}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <Divider />
            {current === 0 && (
              <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
                layout="horizontal"
                size="middle"
              >
                <Form.Item
                  label="Domain name"
                  name="domain"
                  help="without http://, https:// and www"
                  rules={[
                    {
                      required: true,
                      message: "e.g. example.com, blog.example.com",
                      pattern: new RegExp(
                        "(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{1,63}(?<!-).)+[a-zA-Z]{2,63}$)",
                      ),
                    },
                  ]}
                >
                  <Input placeholder="e.g. example.com, blog.example.com" />
                </Form.Item>
              </Form>
            )}
            <div className="steps-action">
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => message.success("Processing complete!")}
                >
                  Done
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                  Previous
                </Button>
              )}
            </div>
          </div>
        </Content>
      </div>
    </>
  );
};

export default DomainMapping;
