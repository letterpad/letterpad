import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Row, Form, Input, Button, Col } from "antd";
import { useState } from "react";

const layout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
    lg: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    lg: { span: 12 },
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
  const onFinish = async (values: any) => {
    setEnabled(false);
    if (executeRecaptcha) {
      const result = await executeRecaptcha("register");
      values.token = result;
      console.log("values :>> ", values);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={20} lg={12}>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
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
          {/* <GoogleReCaptcha
            onVerify={token => {
              setToken(token);
            }}
          /> */}

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
  );
};

const Provider = () => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={"6LdCsL0aAAAAAPbGhkyrhAcr4I_-DkVZYabIkaEa"}
    >
      <Register />
    </GoogleReCaptchaProvider>
  );
};
export default Provider;
