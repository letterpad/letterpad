import React, { useState } from "react";

import { message, Row, Form, Input, Button } from "antd";
import { useRouter } from "next/router";
import {
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
  ResetPasswordDocument,
} from "@/__generated__/queries/mutations.graphql";
import Head from "next/head";
import { basePath } from "@/constants";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { Header } from "antd/lib/layout/layout";

const key = "change-password";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const resetPassword = async () => {
    if (password.length === 0) {
      message.error({
        content: "Password cannot be empty",
        duration: 5000,
        key,
      });
      return;
    }

    if (!router.query.token) {
      message.error({
        content: "Token is missing",
        duration: 5000,
        key,
      });
      return;
    }

    const result = await apolloBrowserClient.mutate<
      ResetPasswordMutation,
      ResetPasswordMutationVariables
    >({
      mutation: ResetPasswordDocument,
      variables: {
        token: router.query.token as string,
        password,
      },
    });

    const data = result.data?.resetPassword;
    if (data && data.ok) {
      message.success({
        content: data.message,
        duration: 1000,
        key,
      });
      router.push(`${basePath}/login`);
    } else if (!data?.ok) {
      message.error({
        content:
          data?.message ||
          "There was a problem making this request. Contact the admin.",
        duration: 5000,
        key,
      });
    }
  };

  const onFinish = (values: any) => {
    setPassword(values.password);
    resetPassword();
  };

  return (
    <>
      <Head>
        <title>Reset password</title>
      </Head>
      <div style={{ height: "100vh" }}>
        <Header className="header">
          <div className="logo">
            <img src="uploads/logo.png" height={30} />
          </div>
        </Header>
        <Row
          justify="center"
          align="middle"
          style={{ paddingLeft: 10, height: "100%" }}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onFinish}
            className="forgot-password-form"
          >
            <Form.Item
              label="Password"
              name="password"
              data-testid="input-password"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Reset Password
              </Button>
            </Form.Item>
            <style jsx global>{`
              .forgot-password-form {
                width: 600px;
              }
              @media (max-width: 800px) {
                .forgot-password-form {
                  width: initial;
                }
              }
            `}</style>
          </Form>
        </Row>
      </div>
    </>
  );
};

export default ResetPassword;
