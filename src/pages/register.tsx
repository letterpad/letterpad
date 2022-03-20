import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import React, { useState } from "react";
import Head from "next/head";
import {
  CreateAuthorDocument,
  useCreateAuthorMutation,
} from "@/__generated__/queries/mutations.graphql";
import { useRouter } from "next/router";

import { Button, Divider, Form, Input, message, Row } from "antd";
import { EventAction, track } from "@/track";
import { Header } from "antd/lib/layout/layout";
import Link from "next/link";
import { SocialLogin } from "@/components/login/views/SocialLogin";
import { getSession } from "next-auth/react";

const key = "register";

const RegisterForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [createAuthor] = useCreateAuthorMutation();

  const [processing, setProcessing] = useState(false);

  const router = useRouter();

  const registerAction = async (formData) => {
    setProcessing(true);
    message.loading({
      content: "Please wait",
      key,
      duration: 5,
    });

    if (executeRecaptcha) {
      const token = await executeRecaptcha("register");
      const { site_title, ...authorData } = formData;
      const formWithToken = { ...authorData, token };

      const result = await createAuthor({
        mutation: CreateAuthorDocument,
        variables: {
          data: {
            ...formWithToken,
            setting: { site_title },
          },
        },
      });
      if (result.errors?.length) {
        message.error({ content: result?.errors, key, duration: 5 });
      } else {
        track({
          eventAction: EventAction.Click,
          eventCategory: "register",
          eventLabel: `success`,
        });
        message.success({ content: "Succcess", key, duration: 5 });
        router.push("/messages/registered");
      }
    }

    setProcessing(false);
  };

  const onFinish = (values: any) => {
    const { name, username, password, email, site_title } = values;
    const formData = { name, username, password, email, site_title };
    registerAction(formData);
  };

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="login" style={{ height: "100vh" }}>
        <Header className="header">
          <div className="logo">
            <img src="uploads/logo.png" height={30} />
          </div>
        </Header>
        <Row
          justify="center"
          align="middle"
          style={{ paddingLeft: 10, height: "calc(100% - 80px)" }}
        >
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onFinish}
            className="register-form"
            style={{ paddingTop: 40 }}
          >
            <h2>Register</h2>
            <Divider />
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                  max: 100,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Site Title"
              name="site_title"
              rules={[
                {
                  required: true,
                  message: "Please input a title of your site!",
                  max: 25,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
                {
                  pattern: /[0-9A-Za-z_.]*/,
                  message: "Can only contain alphabets and numbers",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              data-testid="input-email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                  type: "email",
                },
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              data-testid="input-password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be minimum 6 characters." },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button type="primary" htmlType="submit" disabled={processing}>
                Register
              </Button>
              <Link href="/login">
                <Button type="link">⏎ Login</Button>
              </Link>
            </Form.Item>
            <Divider />
            <SocialLogin />
          </Form>
        </Row>
        <style jsx global>{`
          .register-form {
            width: 500px;
            padding: 30px;
            background: #fbfbfb;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
          }
          input {
            background-color: rgba(var(--color), 0.1) !important;
            color: rgba(var(--color), 0.8) !important;
          }

          @media (max-width: 800px) {
            .register-form {
              width: 100%;
              margin: 20px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

interface Props {
  recaptchaKey: string;
}
const Provider: React.VFC<Props> = ({ recaptchaKey }) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      <RegisterForm />
    </GoogleReCaptchaProvider>
  );
};
export default Provider;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/posts",
      },
      props: {},
    };
  }
  return {
    props: {
      recaptchaKey: process.env.RECAPTCHA_KEY_CLIENT,
    },
  };
};
