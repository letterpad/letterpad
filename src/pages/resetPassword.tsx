import React from "react";

import { message, Row, Form, Input, Button, Divider } from "antd";
import { useRouter } from "next/router";
import {
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
  ResetPasswordDocument,
} from "@/__generated__/queries/mutations.graphql";
import Head from "next/head";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { Header } from "antd/lib/layout/layout";
import { EventAction, track } from "@/track";

const key = "change-password";

const ResetPassword = () => {
  const router = useRouter();

  const resetPassword = async (newPassword: string) => {
    if (newPassword.length === 0) {
      message.error({
        content: "Password cannot be empty",
        duration: 5,
        key,
      });
      return;
    }

    if (!router.query.token) {
      message.error({
        content: "Token is missing",
        duration: 5,
        key,
      });
      return;
    }

    track({
      eventAction: EventAction.Click,
      eventCategory: "reset-password",
      eventLabel: "with-token",
    });

    const result = await apolloBrowserClient.mutate<
      ResetPasswordMutation,
      ResetPasswordMutationVariables
    >({
      mutation: ResetPasswordDocument,
      variables: {
        token: router.query.token as string,
        password: newPassword,
      },
    });

    const data = result.data?.resetPassword;
    if (data && data.ok) {
      message.success({
        content: data.message,
        duration: 10,
        key,
      });
      router.push("/login");
    } else if (!data?.ok) {
      message.error({
        content:
          data?.message ||
          "There was a problem making this request. Contact the admin.",
        duration: 5,
        key,
      });
    }
  };

  const onFinish = (values: any) => {
    resetPassword(values.password);
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
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onFinish}
            className="reset-password-form"
          >
            <h2>Reset Password</h2>
            <Divider />
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
              .reset-password-form {
                width: 500px;
                padding: 30px;
                background: #fbfbfb;
                border: 1px solid #d9d9d9;
                border-radius: 2px;
              }
              @media (max-width: 800px) {
                .reset-password-form {
                  width: 100%;
                  margin: 20px;
                }
              }
            `}</style>
          </Form>
        </Row>
      </div>
    </>
  );
};
ResetPassword.noSession = true;
export default ResetPassword;
