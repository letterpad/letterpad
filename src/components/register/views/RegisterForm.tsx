import { Button, Divider, Form, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import css from "@/components/login/views/style.module.css";

import { DividerWithOr } from "@/components/login/views/Divider";
import { Logo } from "@/components/login/views/Logo";
import { SocialLogin } from "@/components/login/views/SocialLogin";

import {
  CreateAuthorDocument,
  useCreateAuthorMutation,
} from "@/__generated__/queries/mutations.graphql";
import { EventAction, track } from "@/track";

const key = "register";
export const RegisterForm = () => {
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
      if (result.data?.createAuthor?.__typename === "CreateAuthorError") {
        message.error({
          content: result.data?.createAuthor.message,
          key,
          duration: 5,
        });
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
      <div className={css.wrapper}>
        <div className={css.leftBox}>
          <span>Letterpad</span>
        </div>
        <div className={css.rightBox}>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onFinish}
            className={css.forms}
          >
            <Logo />
            <Divider />
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                  max: 100,
                },
              ]}
            >
              <Input placeholder="Enter your Name" />
            </Form.Item>
            <Form.Item
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
              <Input autoComplete="off" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              name="password"
              data-testid="input-password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be minimum 6 characters." },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item
              name="site_title"
              rules={[
                {
                  required: true,
                  message: "Please input a title of your site!",
                  max: 25,
                },
              ]}
            >
              <Input placeholder="Enter a name for your site" />
            </Form.Item>
            <Form.Item
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
              <Input placeholder="Enter a username" />
            </Form.Item>

            <Form.Item>
              <br />
              <Button
                type="primary"
                htmlType="submit"
                disabled={processing}
                style={{ width: "100%" }}
              >
                Register
              </Button>
            </Form.Item>
            <DividerWithOr />
            <br />
            <SocialLogin mode="register" />
            <br />
            <Form.Item
              name="remember"
              valuePropName="checked"
              style={{ textAlign: "center" }}
            >
              Already have an account ?
              <Link href="/login">
                <Button type="link">Login</Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
