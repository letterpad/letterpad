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

import {
  Block,
  Button,
  Container,
  InputBlock,
  Row,
} from "@/components/login/login.css";
import { message } from "antd";
import { EventAction, track } from "@/track";

const key = "register";
const fields = {
  site_title: "",
  username: "",
  email: "",
  password: "",
  name: "",
};

const RegisterForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [createAuthor] = useCreateAuthorMutation();
  const [form, setForm] = useState(fields);

  const [errors, setErrors] = useState(fields);

  const [processing, setProcessing] = useState(false);

  const router = useRouter();

  const registerAction = async () => {
    setProcessing(true);
    setErrors(fields);
    const errorObj = validate(form);

    const newErrors = Object.keys(errorObj).filter(
      (field) => errorObj[field] !== "",
    );

    if (newErrors.length > 0) {
      setErrors({ ...fields, ...errorObj });
      setProcessing(false);
      return;
    }
    message.loading({
      content: "Please wait",
      key,
      duration: 5,
    });

    if (executeRecaptcha) {
      const token = await executeRecaptcha("register");
      const { site_title, ...authorData } = form;
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

  return (
    <Container>
      <Head>
        <title>Register</title>
      </Head>
      <div className="login">
        <h1>Letterpad</h1>
        <Block isVisible={true}>
          <InputBlock>
            <input
              type="text"
              placeholder="Enter a title of your blog"
              value={form.site_title}
              onChange={(e) => setForm({ ...form, site_title: e.target.value })}
              autoComplete="off"
              data-testid="input-email"
            />
            {errors.site_title && (
              <span className="error">{errors.site_title}</span>
            )}
          </InputBlock>
          <InputBlock>
            <input
              type="text"
              placeholder="Enter your name as an author"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="off"
              data-testid="input-email"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </InputBlock>
          <InputBlock>
            <input
              type="text"
              placeholder="Enter a username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="off"
              data-testid="input-email"
              style={{ width: 200 }}
            />
            <span style={{ fontSize: 15, letterSpacing: 2 }}>
              &nbsp;&nbsp;.letterpad.app
            </span>
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}
          </InputBlock>
          <InputBlock>
            <input
              type="text"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="off"
              data-testid="input-email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </InputBlock>
          <InputBlock>
            <input
              type="password"
              placeholder="Enter a new password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              value={form.password}
              autoComplete="off"
              onKeyUp={(e: React.KeyboardEvent) => {
                if (e.keyCode === 13) {
                  registerAction();
                }
              }}
              data-testid="input-password"
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </InputBlock>
          <br />
          <Row justify="center">
            <Button
              onClick={registerAction}
              data-testid="btn-login"
              disabled={processing}
            >
              Register
            </Button>
          </Row>
        </Block>
      </div>
    </Container>
  );
};

const Provider = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.RECAPTCHA_KEY_CLIENT}>
      <RegisterForm />
    </GoogleReCaptchaProvider>
  );
};
export default Provider;

function validate(form: typeof fields) {
  const sanitisedForm = { ...form };
  const errors: typeof fields = { ...fields };
  for (const field in form) {
    sanitisedForm[field] = form[field].trim();
    if (sanitisedForm[field].length === 0) {
      errors[field] = `${field.replace("_", " ")} cannot be empty`;
    }
  }

  if (!/^[a-z0-9]+$/i.test(sanitisedForm.username)) {
    errors.username = "Username cannot contain spaces or special characters";
  }

  if (sanitisedForm.password.length < 6) {
    errors.password = "Password should have minimum 6 characters";
  }

  return errors;
}
