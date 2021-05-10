import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Row, Form, Input, Button, Col, message } from "antd";
import { useState } from "react";
import { initializeApollo } from "@/graphql/apollo";
import {
  CreateAuthorMutation,
  CreateAuthorMutationVariables,
  CreateAuthorDocument,
} from "@/__generated__/queries/mutations.graphql";
import { useRouter } from "next/router";

const layout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
  },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
    url: "${label} is not a valid url!",
  },
};

const Register = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [enabled, setEnabled] = useState(true);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setEnabled(false);
    const key = "updatable";

    message.loading({ content: "Please wait...", key });
    if (executeRecaptcha) {
      const token = await executeRecaptcha("register");
      values.token = token;
      delete values.confirmPassword;
      const result = await createAuthor(values);
      if (!result?.status) {
        message.error({ content: result?.message, key, duration: 5 });
        setEnabled(true);
      } else {
        message.success({ content: "Succcess", key, duration: 5 });
        router.push("/messages/registered");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 100 }}>
      <Row justify="center" align="middle">
        <p>
          <img src="/admin/uploads/logo.png" width={60} />
        </p>
      </Row>
      <Row justify="center" align="middle">
        <Col md={16} lg={12}>
          <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
            className={"register"}
          >
            <Form.Item
              name={["site_title"]}
              label="Site Title"
              rules={[
                {
                  required: true,
                  message: "Please enter the title of your site",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["name"]}
              label="Full Name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["email"]}
              label="Email"
              rules={[
                { type: "email", message: "Email is not valid" },
                { required: true, message: "Please enter your email" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["password"]}
              label="Password"
              rules={[
                { type: "string" },
                { required: true, message: "Please enter a password" },
              ]}
            >
              <Input type="password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name={["confirmPassword"]}
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue(["password"]) === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!",
                      ),
                    );
                  },
                }),
              ]}
            >
              <Input name="passwordTwo" type="password" />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                ...layout.wrapperCol,
                xs: { offset: 0 },
                sm: { offset: 8 },
              }}
            >
              <Button type="primary" htmlType="submit" disabled={!enabled}>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

const Provider = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LdCsL0aAAAAAPbGhkyrhAcr4I_-DkVZYabIkaEa">
      <Register />
    </GoogleReCaptchaProvider>
  );
};
export default Provider;

async function createAuthor(
  data,
): Promise<{ status: boolean; message: string } | null> {
  const client = await initializeApollo();

  const result = await client.mutate<
    CreateAuthorMutation,
    CreateAuthorMutationVariables
  >({
    mutation: CreateAuthorDocument,
    variables: {
      data,
    },
  });

  if (result.data?.createAuthor?.__typename === "CreateAuthorError") {
    return {
      status: false,
      message: result.data.createAuthor.message,
    };
  }
  if (result.data?.createAuthor?.__typename === "Author") {
    return {
      status: true,
      message: "",
    };
  }
  return null;
}
